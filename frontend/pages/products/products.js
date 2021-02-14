import Pagination from "../../components/Pagination";
import Products from "../../components/Products";
import { useRouter } from "next/router";

export default function ProductsPage() {
  const { query } = useRouter();

  const page = query.page ? parseInt(query.page, 10) : 1;

  return (
    <div>
      <Pagination page={page || 1} />
      <Products page={page || 1} perPage={2} />
      <Pagination page={page || 1} />
    </div>
  );
}
