export default function Paginator({ setPage }) {
  return (
    <div>
      <button onClick={() => setPage(1)}>Pizza 1</button>
      <button onClick={() => setPage(2)}>Pizza 2</button>
      <button onClick={() => setPage(3)}>Error 404</button>
    </div>
  );
}
