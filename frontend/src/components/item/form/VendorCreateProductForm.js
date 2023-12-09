import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../../../apis/auth';
import { createProduct } from '../../../apis/product';
import { regexTest, numberTest } from '../../../helper/test';
import Input from '../../ui/Input';
import InputFile from '../../ui/InputFile';
import TextArea from '../../ui/TextArea';
import Loading from '../../ui/Loading';
import Error from '../../ui/Error';
import Success from '../../ui/Success';
import ConfirmDialog from '../../ui/ConfirmDialog';
import CategorySelector from '../../seletor/CategorySelector';
import StyleSelector from '../../seletor/StyleSelector';

const VendorCreateProductForm = ({ storeId = '' }) => {
    const [isloading, setIsLoading] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newProduct, setNewProduct] = useState({
        name: '',
        categoryId: '',
        image0: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
        description: '',
        quantity: 0,
        price: 0,
        promotionalPrice: 0,
        styleValueIds: '',
        isValidName: true,
        isValidImage0: true,
        isValidImage1: true,
        isValidImage2: true,
        isValidImage3: true,
        isValidImage4: true,
        isValidImage5: true,
        isValidDescription: true,
        isValidQuantity: true,
        isValidPrice: true,
        isValidPromotionalPrice: true,
    });

    const { _id, accessToken } = getToken();

    const handleChange = (name, isValidName, value) => {
        setNewProduct({
            ...newProduct,
            [name]: value,
            [isValidName]: true,
        });
    };

    const handleValidate = (isValidName, flag) => {
        setNewProduct({
            ...newProduct,
            [isValidName]: flag,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const {
            name,
            categoryId,
            image0,
            description,
            quantity,
            price,
            promotionalPrice,
        } = newProduct;
        if (
            !name ||
            !categoryId ||
            !image0 ||
            !description ||
            !quantity ||
            !price ||
            !promotionalPrice
        ) {
            setNewProduct({
                ...newProduct,
                isValidName: regexTest('anything', name),
                isValidImage0: !!image0,
                isValidDescription: regexTest('bio', description),
                isValidQuantity: numberTest('positive|zero', quantity),
                isValidPrice: numberTest('positive|zero', price),
                promotionalPrice: numberTest('positive|zero', promotionalPrice),
            });
            return;
        }

        const {
            isValidName,
            isValidImage0,
            isValidDescription,
            isValidQuantity,
            isValidPrice,
            isValidPromotionalPrice,
        } = newProduct;
        if (
            !isValidName ||
            !isValidImage0 ||
            !isValidDescription ||
            !isValidQuantity ||
            !isValidPrice ||
            !isValidPromotionalPrice
        )
            return;

        setIsConfirming(true);
    };

    const onSubmit = () => {
        const formData = new FormData();
        formData.set('name', newProduct.name);
        formData.set('description', newProduct.description);
        formData.set('quantity', newProduct.quantity);
        formData.set('price', newProduct.price);
        formData.set('promotionalPrice', newProduct.promotionalPrice);
        formData.set('image0', newProduct.image0);
        formData.set('categoryId', newProduct.categoryId);
        if (newProduct.styleValueIds && newProduct.styleValueIds.length > 0)
            formData.set('styleValueIds', newProduct.styleValueIds.join('|'));
        if (newProduct.image1) formData.set('image1', newProduct.image1);
        if (newProduct.image2) formData.set('image2', newProduct.image2);
        if (newProduct.image3) formData.set('image3', newProduct.image3);
        if (newProduct.image4) formData.set('image4', newProduct.image4);
        if (newProduct.image5) formData.set('image5', newProduct.image5);

        setError('');
        setSuccess('');
        setIsLoading(true);
        createProduct(_id, accessToken, formData, storeId)
            .then((data) => {
                if (data.error) setError(data.error);
                else setSuccess(data.success);
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                    setSuccess('');
                }, 3000);
            })
            .catch((error) => {
                setError('Sever error');
                setIsLoading(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            });
    };

    return (
        <div className="position-relative p-1">
            {isloading && <Loading />}
            {isConfirming && (
                <ConfirmDialog
                    title="Create product"
                    onSubmit={onSubmit}
                    onClose={() => setIsConfirming(false)}
                />
            )}

            <form
                className="border border-primary rounded-3 row mb-2"
                onSubmit={handleSubmit}
            >
                <div className="col-12 bg-primary p-3">
                    <h1 className="text-white fs-5 m-0">Create new product</h1>
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="text"
                        label="Product name"
                        value={newProduct.name}
                        isValid={newProduct.isValidName}
                        feedback="Please provide a valid product name."
                        validator="anything"
                        onChange={(value) =>
                            handleChange('name', 'isValidName', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidName', flag)
                        }
                    />
                </div>

                <div className="col-12 mt-2 px-4">
                    <InputFile
                        label="Product avatar"
                        size="avatar"
                        noRadius={true}
                        value={newProduct.image0}
                        isValid={newProduct.isValidImage0}
                        feedback="Please provide a valid product avatar."
                        accept="image/jpg, image/jpeg, image/png, image/gif"
                        onChange={(value) =>
                            handleChange('image0', 'isValidImage0', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidImage0', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                        <InputFile
                            label="Product other images"
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image1}
                            isValid={newProduct.isValidImage1}
                            feedback="Please provide a valid other images."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image1', 'isValidImage1', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage1', flag)
                            }
                        />

                        <InputFile
                            label=""
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image2}
                            isValid={newProduct.isValidImage2}
                            feedback="Please provide a valid other images."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image2', 'isValidImage2', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage2', flag)
                            }
                        />

                        <InputFile
                            label=""
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image3}
                            isValid={newProduct.isValidImage3}
                            feedback="Please provide a valid other images."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image3', 'isValidImage3', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage3', flag)
                            }
                        />

                        <InputFile
                            label=""
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image4}
                            isValid={newProduct.isValidImage4}
                            feedback="Please provide a valid other images."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image4', 'isValidImage4', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage4', flag)
                            }
                        />

                        <InputFile
                            label=""
                            size="avatar"
                            noRadius={true}
                            value={newProduct.image5}
                            isValid={newProduct.isValidImage5}
                            feedback="Please provide a valid other images."
                            accept="image/jpg, image/jpeg, image/png, image/gif"
                            onChange={(value) =>
                                handleChange('image5', 'isValidImage5', value)
                            }
                            onValidate={(flag) =>
                                handleValidate('isValidImage5', flag)
                            }
                        />
                    </div>
                </div>

                <div className="col-12 px-4">
                    <TextArea
                        type="text"
                        label="Description"
                        value={newProduct.description}
                        isValid={newProduct.isValidDescription}
                        feedback="Please provide a valid product description."
                        validator="bio"
                        onChange={(value) =>
                            handleChange(
                                'description',
                                'isValidDescription',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidDescription', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="number"
                        label="Quantity"
                        value={newProduct.quantity}
                        isValid={newProduct.isValidQuantity}
                        feedback="Please provide a valid product quantity."
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange('quantity', 'isValidQuantity', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidQuantity', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="number"
                        label="Price (VND)"
                        value={newProduct.price}
                        isValid={newProduct.isValidPrice}
                        feedback="Please provide a valid product price."
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange('price', 'isValidPrice', value)
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPrice', flag)
                        }
                    />
                </div>

                <div className="col-12 px-4">
                    <Input
                        type="number"
                        label="Promotional price (VND)"
                        value={newProduct.promotionalPrice}
                        isValid={newProduct.isValidPromotionalPrice}
                        feedback="Please provide a valid product promotional price."
                        validator="positive|zero"
                        onChange={(value) =>
                            handleChange(
                                'promotionalPrice',
                                'isValidPromotionalPrice',
                                value,
                            )
                        }
                        onValidate={(flag) =>
                            handleValidate('isValidPromotionalPrice', flag)
                        }
                    />
                </div>

                <div className="col-12 mt-5 px-4">
                    <p className="">Choose category</p>
                    <CategorySelector
                        label="Choosed category"
                        isActive={true}
                        isRequired={true}
                        onSet={(category) =>
                            setNewProduct({
                                ...newProduct,
                                categoryId: category._id,
                            })
                        }
                    />
                </div>

                <div className="col-12 mt-5 px-4">
                    <p className="px-2">
                        Choose styles{' '}
                        <small className="text-muted">
                            *need to choose category before
                        </small>
                    </p>
                    <StyleSelector
                        label="Choosed styles"
                        categoryId={newProduct.categoryId}
                        onSet={(styleValues) => {
                            setNewProduct({
                                ...newProduct,
                                styleValueIds: styleValues.map(
                                    (value) => value._id,
                                ),
                            });
                        }}
                    />
                </div>

                {error && (
                    <div className="col-12 px-4">
                        <Error msg={error} />
                    </div>
                )}

                {success && (
                    <div className="col-12 px-4">
                        <Success msg={success} />
                    </div>
                )}
                <div className="col-12 px-4 pb-3 d-flex justify-content-between align-items-center mt-4 res-flex-reverse-md">
                    <Link
                        to={`/vendor/products/${storeId}`}
                        className="text-decoration-none cus-link-hover res-w-100-md my-2"
                    >
                        <i className="fas fa-arrow-circle-left"></i> Back to
                        Product Manager
                    </Link>
                    <button
                        type="submit"
                        className="btn btn-primary ripple res-w-100-md"
                        onClick={handleSubmit}
                        style={{ width: '324px', maxWidth: '100%' }}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorCreateProductForm;
