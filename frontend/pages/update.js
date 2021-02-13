import UpdateProduct from "../components/UpdateProduct";

function UpdatePage({ query }) {
  return (
    <div>
      <UpdateProduct id={query.id} />
    </div>
  );
}

export default UpdatePage;
