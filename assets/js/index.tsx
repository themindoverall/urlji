import React, { ChangeEvent, useCallback } from "react";

function URLji() {
  return <>URL<ruby>字<rt>ji</rt></ruby></>;
}

function ExpandingTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${event.target.scrollHeight}px`;
    if (props.onChange) {
      return props.onChange(event);
    }
  };

  return <textarea {...props} onChange={handleChange}></textarea>;
}

function copyToClipboard(text: string) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let successful = document.execCommand('copy');
  if (!successful) {
    throw new Error("command failed");
  }

  document.body.removeChild(textArea);
}

function CopyToClipboard({ value }) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleClick = React.useCallback(() => {
    copyToClipboard(value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [value, setIsCopied]);

  if (isCopied) {
    return (
      <span>Copied!</span>
    );
  }

  return (
    <button type="button" onClick={handleClick}>[Copy to Clipboard]</button>
  );
}

function useAnimation(callback) {
  const requestRef = React.useRef<number>();
  
  React.useEffect(() => {
    const animate = time => {
      let canceled = false;
      if (callback(time) === false) {
        canceled = true;
      }
      if (!canceled) {
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [callback]);
}

function ShowUrlji({ urlji, dispatch }) {
  const goBack = () => {
    dispatch({ type: "GO_BACK" });
  }

  const [outputUrl, setOutputUrl] = React.useState("");

  useAnimation(() => {
    const now = performance.now();

    const [baseUrl, ...slug] = urlji.url;

    // 1000ms to roll out the base url, 50ms/character to eat the original url
    const baseUrlTime = 1000;
    const originalUrlTime = urlji.original_url.length * 50;
    const totalTime = baseUrlTime + originalUrlTime;

    const time = now - urlji.startTime;
    if (time < baseUrlTime) {
      // do baseUrl unroll
      const progress = time / baseUrlTime;

      setOutputUrl(`${baseUrl.substring(0, progress * baseUrl.length)}${urlji.original_url}`);
    } else {
      // do originaUrl eating
      const progress = ((time - baseUrlTime) / originalUrlTime);

      const outputParts = [baseUrl, "/"];
      
      // add an emoji at an even interval across the progress
      outputParts.push(...slug.slice(0, Math.floor(progress * slug.length)));

      // remove characters from the beginning of the original_url as progress increases 
      outputParts.push(urlji.original_url.substring(progress * urlji.original_url.length));

      setOutputUrl(outputParts.join(""));
    }

    if (time >= totalTime) {
      return false;
    }
  });

  const [baseUrl, ...slug] = urlji.url;
  const urljiUrl = `${baseUrl}/${slug.join("")}`;

  return (
    <div id="output">
      <div className="url">{outputUrl}</div>
      <CopyToClipboard value={urljiUrl} />
      <button type="button" onClick={goBack}>Go back</button>
    </div>
  );
}

async function submitUrljiForm(dispatch, form) {
  dispatch({ type: "URLJI_FORM_SUBMITTING" });
  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: form.body,
    });
    const payload = await response.json();
    dispatch({ type: "URLJI_FORM_SUBMITTED", payload });
  } catch (error) {
    dispatch({ type: "URLJI_FORM_ERROR" });
  }
}

export function UrljiForm({ form, dispatch }) {
  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    const htmlForm = event.target as HTMLFormElement;
    submitUrljiForm(dispatch, {
      action: htmlForm.action,
      method: htmlForm.method,
      body: new FormData(htmlForm),
    });
  }, [dispatch]);

  return (
    <form method="POST" action="/urlji" onSubmit={handleSubmit}>
      <ExpandingTextarea name="url" rows={1} placeholder="https://" className="url" />
      <button type="submit" disabled={form?.submitting}>[{form?.submitting ? "Generating" : "Generate" } <URLji />]</button>
      {form?.error ?? <span>{form?.error}</span>}
    </form>
  );
}

const reducer = (state, action) => {
  switch (action.type) {
    case "URLJI_FORM_SUBMITTING": {
      return {
        ...state,
        form: {
          submitting: true,
        }
      };
    } break;
    case "URLJI_FORM_SUBMITTED": {
      return {
        ...state,
        form: {
          submitting: false,
        },
        urlji: {
          ...action.payload,
          startTime: performance.now(),
        }
      };
    } break;
    case "URLJI_FORM_ERROR": {
      return {
        ...state,
        form: {
          submitting: false,
          error: action.payload,
        }
      };
    } break;
    case "GO_BACK": {
      return {};
    } break;
  }
  return state;
};

export default function Index() {
  const [state, dispatch] = React.useReducer(reducer, {});

  const page = state.urlji ?
    (
      <ShowUrlji urlji={state.urlji} dispatch={dispatch} />
    ) : (
      <UrljiForm form={state.form} dispatch={dispatch} />
    );

  return (
    <div>
      Using an advanced computer science algorithm known as <a
        href="https://translate.google.com/?sl=ja&tl=en&text=%E5%98%98%0A&op=translate"
        target="_blank">
        <ruby>嘘<rt>uso</rt></ruby>
      </a>, this website can reduce any URL down to its <URLji /> —
      a trilogy of emoji that capture its essence.
      {page}
    </div>
  );
}
