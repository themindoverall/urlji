import React from "react";
import { reducer, submitUrljiForm, Dispatch, State } from "./state";
import { copyToClipboard, ExpandingTextarea, useAnimation } from "./util";

function URLji() {
  return <>URL<ruby>字<rt>ji</rt></ruby></>;
}

interface CopyToClipboardProps {
  value: string;
}
function CopyToClipboard({ value }: CopyToClipboardProps) {
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

interface ShowUrljiProps {
  urlji: Required<State>["urlji"];
  dispatch: Dispatch;
}
function ShowUrlji({ urlji, dispatch }: ShowUrljiProps) {
  const goBack = () => {
    dispatch({ type: "GO_BACK" });
  }

  const [outputUrl, setOutputUrl] = React.useState("");

  const animationCallback = React.useCallback(() => {
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
  }, [urlji, setOutputUrl]);

  useAnimation(animationCallback);

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

interface UrljiFormProps {
  form: State["form"];
  dispatch: Dispatch;
}
function UrljiForm({ form, dispatch }: UrljiFormProps) {
  const handleSubmit = React.useCallback((event: React.FormEvent) => {
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
