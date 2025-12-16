import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import axios from "axios";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);


  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product`
      );
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.log(error);
    }

  };
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"All Products - Best offers"}>
      <div className="row mt-3">
        <div className="col-md-3">
          <h4 className="text-center">Filter by category</h4>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p) => (

              <div className="card m-2" style={{ width: '18rem' }}>
                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                <div className="card-body">
                  <h5 className="card-title"> {p.name}</h5>
                  <p className="card-text">{
                    p.description
                  }</p>
                  <button class="btn btn-primary ms-1">More details</button>
                  <button class="btn btn-secondary ms-1">Add to cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
