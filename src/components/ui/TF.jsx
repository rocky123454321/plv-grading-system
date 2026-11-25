/** Shows a boolean as a green T or a red F. */
export default function TF({ value }) {
  return (
    <span className={value ? "tf tf-true" : "tf tf-false"} aria-label={value ? "true" : "false"}>
      {value ? "T" : "F"}
    </span>
  );
}
