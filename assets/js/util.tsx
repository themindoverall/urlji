import React from "react";

export function useAnimation(callback) {
  const requestRef = React.useRef<number>();
  
  React.useEffect(() => {
    const animate = time => {
      let running = true;
      if (callback(time) === false) {
        running = false;
      }
      if (running) {
        requestRef.current = requestAnimationFrame(animate);
      }
    }
  
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [callback]);
}

export function copyToClipboard(text: string) {
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

export function ExpandingTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${event.target.scrollHeight}px`;
    if (props.onChange) {
      return props.onChange(event);
    }
  };

  return <textarea {...props} onChange={handleChange}></textarea>;
}
