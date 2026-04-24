interface CopyMessage {
  target: "offscreen";
  type: "copy";
  text: string;
}

function isCopyMessage(msg: unknown): msg is CopyMessage {
  return (
    typeof msg === "object" &&
    msg !== null &&
    (msg as CopyMessage).target === "offscreen" &&
    (msg as CopyMessage).type === "copy" &&
    typeof (msg as CopyMessage).text === "string"
  );
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (!isCopyMessage(msg)) return false;
  navigator.clipboard
    .writeText(msg.text)
    .then(() => sendResponse({ ok: true }))
    .catch((err: unknown) =>
      sendResponse({ ok: false, error: String(err) }),
    );
  return true;
});
