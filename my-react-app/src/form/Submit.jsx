import "./Submit.css";
export default function Submit({children}) {
  return (
    <div className="control">
      <button type="submit">{children}</button>
    </div>
  );
}
