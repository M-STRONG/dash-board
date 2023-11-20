import { useEffect, useState } from "react";
import "./App.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useAppStore } from "./store";

const EditModal = () => {
  const { open, setOpen, title, price, setTitle, setPrice, id } = useAppStore();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/${id}`, {
      method: "PUT" /* or PATCH */,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setOpen(false)
        alert(`${id} is updated`);
      });
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} center>
      <h2>Edit Product</h2>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <br />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />
      <br />
      <button onClick={() => handleSave()}>{loading ? "Lodaing...": "Save"}</button>
    </Modal>
  );
};

function App() {
  const [products, setProducts] = useState([]);
  const { setOpen, setTitle, setPrice, setID } = useAppStore();

  const loadProducts = async () => {
    // fetch("https://dummyjson.com/products")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //   });

    try {
      let resp = await fetch("https://dummyjson.com/products");
      let data = await resp.json();
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProduct = async (productID) => {
    // fetch(`https://dummyjson.com/products/${productID}`, {
    //   method: "DELETE",
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.isDeleted === true) {
    //       alert("Delete Successfull!");
    //     }
    //   });

    try {
      let resp = await fetch(`https://dummyjson.com/products/${productID}`, {
        method: "DELETE",
      });
      let data = await resp.json();
      if (data.isDeleted === true) {
        alert(`${productID} is Deleted`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <h4>Fetch Api</h4>
      {/* <ul>
        {products.map((el) => (
          <li>{el.title}</li>
        ))}
      </ul> */}
      <table>
        <thead style={{ background: "#ccc" }}>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((el, i) => (
            <tr key={i}>
              <td>{el.id}</td>
              <td>{el.title}</td>
              <td>{el.price}</td>
              <td>
                <button
                  onClick={() => {
                    setOpen(true);
                    setID(el.id);
                    setTitle(el.title);
                    setPrice(el.price);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteProduct(el.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditModal />
    </div>
  );
}

export default App;
