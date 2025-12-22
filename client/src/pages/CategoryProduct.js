import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CategoryProduct = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({});
    const params = useParams();
    const navigate = useNavigate();

    const fetchProductsByCategory = async () => {
        // Fetch products by category slug from backend
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.error("Error fetching products by category:", error);
        }
    };
    useEffect(() => {
        if (params?.slug)
            fetchProductsByCategory();
    }, [params.slug]);

    return (
        <Layout>
            <div className="container">
                <h2 className='text-center mt-3'>Category - {category?.name}</h2>
                <h6 className='text-center mt-3'>{products?.length} result found</h6>
                <div className="row">
                    <div className="d-flex flex-wrap">
                        {products?.map((p) => (

                            <div className="card m-2" style={{ width: '18rem' }}>
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title"> {p.name}</h5>
                                    <p className="card-text">{
                                        p.description.substring(0, 30)
                                    }...</p>
                                    <p className="card-text">$ {
                                        p.price
                                    }</p>
                                    <button onClick={() => navigate(`/product/${p.slug}`)} className="btn btn-primary ms-1">More details</button>
                                    <button className="btn btn-secondary ms-1">Add to cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CategoryProduct;