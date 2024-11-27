import React, { useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    categoryId: string;
    categoryName: string;
}

interface Category {
    id: string;
    name: string;
}

const CompleteInfo: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product>();
    const [productId, setProductId] = useState<string>('');
    const [removeProductId, setRemoveProductId] = useState<string>('');
    const [newProduct, setNewProduct] = useState<Product>({ id: '', name: '', price: 0, categoryId: '', categoryName: '' });
    const [categories, setCategories] = useState<Category[]>([]);
    const [updateProduct, setUpdateProduct] = useState<Product>({ id: '', name: '', price: 0, categoryId: '', categoryName: '' });

    const fetchAllProducts = async () => {
        try {
            const response = await fetch('http://localhost:5031/products');
            if(!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setProducts(data);
            console.log(data);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }
    
    const fetchAllCategories = async () => {
        try {
            const response = await fetch('http://localhost:5031/categories');
            if(!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setCategories(data);
            console.log(data);
        } catch(error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    const fetchProductById = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5031/products/${id}`);
            if(!response.ok) {
                setProduct(undefined);
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setProduct(data);
            console.log(data);
        } catch(error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    const removeProduct = async (id: string) => {
        console.log("Removing product with ID: ", id);
        try {
            const response = await fetch(`http://localhost:5031/product/${id}`, {
                method: 'DELETE',
            });
            if(!response.ok) {
                throw new Error('Failed to delete data');
            }
            setProducts(products.filter((product) => product.id !== id));
        } catch(error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    const createProduct = async () => {
        try {
            const response = await fetch('http://localhost:5031/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            const data = await response.json();
            setProducts([...products, data]);
            setNewProduct({ id: '', name: '', price: 0, categoryId: '', categoryName: '' });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    const updateProductById = async () => {
        try {
            const response = await fetch(`http://localhost:5031/product/${updateProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateProduct),
            });
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            const data = await response.json();
            setProducts(products.map((product) => (product.id === data.id ? data : product)));
            setUpdateProduct({ id: '', name: '', price: 0, categoryId: '', categoryName: '' });
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    }

    const handleFetchProductById = async (id: string) => {
        setProductId(id);
    }

    const handleRemoveProduct = async () => {
        if (removeProductId) {
            console.log("Removing product with ID: ", removeProductId);
            await removeProduct(removeProductId);
        } else {
            console.error("Product ID is empty");
        }
    }

    return (
        <div>
            <h1>Complete Info</h1>
            <div>
                <button onClick={fetchAllProducts}>Fetch All Products</button>
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.id} - {product.name} - {product.price} - {product.categoryId} - {product.categoryName}
                        </li>
                    ))}
                </ul>
                <button onClick={fetchAllCategories}>Fetch All Categories</button>
                <ul>
                    {categories.map((category) => (
                        <li key={category.id}>
                            {category.id} - {category.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <input 
                    type="text"
                    onChange={(e) => handleFetchProductById(e.target.value)}
                    placeholder="Enter product ID"
                />
                <button onClick={() => fetchProductById(productId)}>Fetch Product by ID</button>
            </div>
            {product && (
                <div>
                    <h2>Product Details</h2>
                    <p>ID: {product.id}</p>
                    <p>Name: {product.name}</p>
                    <p>Price: {product.price}</p>
                    <p>Category ID: {product.categoryId}</p>
                    <p>Category Name: {product.categoryName}</p>
                </div>
            )}

            <div>
                <h1>Remove Product</h1>
                <input 
                    type="text"
                    value={removeProductId}
                    onChange={(e) => setRemoveProductId(e.target.value)}
                    placeholder="Enter product ID to remove" 
                />
                <button onClick={handleRemoveProduct}>Remove Product by ID</button>
            </div>

            <div>
                <h1>Create New Product</h1>
                <input 
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                />
                <input 
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    placeholder="Enter product price"
                />
                <input 
                    type="text"
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                    placeholder="Enter category ID"
                />
                <button onClick={createProduct}>Create Product</button>
            </div>

            <div>
                <h1>Update Product</h1>
                <input 
                    type="text"
                    value={updateProduct.id}
                    onChange={(e) => setUpdateProduct({ ...updateProduct, id: e.target.value })}
                    placeholder="Enter product ID"
                />
                <input 
                    type="text"
                    value={updateProduct.name}
                    onChange={(e) => setUpdateProduct({ ...updateProduct, name: e.target.value })}
                    placeholder="Enter product name"
                />
                <input 
                    type="number"
                    value={updateProduct.price}
                    onChange={(e) => setUpdateProduct({ ...updateProduct, price: parseFloat(e.target.value) })}
                    placeholder="Enter product price"
                />
                <input 
                    type="text"
                    value={updateProduct.categoryId}
                    onChange={(e) => setUpdateProduct({ ...updateProduct, categoryId: e.target.value })}
                    placeholder="Enter category ID"
                />
                <button onClick={updateProductById}>Update Product</button>
            </div>
        </div>
    )
}

export default CompleteInfo;