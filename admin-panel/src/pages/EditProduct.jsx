
import { useParams } from 'react-router'

export default function EditProduct() {
    // id from params
    const id = useParams();
    console.log(id);
  return (
    <div>EditProduct</div>
  )
}
