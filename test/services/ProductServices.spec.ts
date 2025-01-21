import ProductServices  from '../../src/services/ProductServices';
import Product from '../../src/models/Product';
import { IProduct } from '../../src/models/Product';

jest.mock('../../src/models/Product');
jest.mock('../../src/config/logger');
jest.mock('../../src/utils/formatedProductName');

describe('createProduct', () => {

    it('should create a product successfully', async () => {

        const formatedProductName = jest.fn().mockImplementation((productName: string) => {
            return productName;
        });
        (formatedProductName as jest.Mock).mockResolvedValueOnce('Test product');

        const mockSave = jest.fn().mockImplementation(function (this: IProduct) {
            this._id = 'mock-id';
            this.name = 'Test product'
            return Promise.resolve(this);
        });

        const resultFormatedProductName = await formatedProductName("test product");

        const mockProduct =  new Product({ name: resultFormatedProductName });
        mockProduct.save = mockSave;

        (Product.create as jest.Mock).mockImplementationOnce(() => mockProduct);

        const result = await mockProduct.save();
        
        expect(formatedProductName).toHaveBeenCalledWith('test product');
        expect(resultFormatedProductName).toBe('Test product');
        expect(Product).toHaveBeenCalledWith({ name: 'Test product' });
        expect(mockSave).toHaveBeenCalled();

        expect(result).toMatchObject({
            _id: 'mock-id',
            name: 'Test product',
        });
    });

    it('should throw an error if productName is not provided', async () => {
        await expect(ProductServices.createProduct('')).rejects.toThrow('impossible de créer un produit sans le nom');
    });
});

describe('findProductByName', () => {

    it('should find a product by name successfully', async () => {
        const formatedProductName = jest.fn().mockImplementation((productName: string) => {
            return productName;
        });
        (formatedProductName as jest.Mock).mockReturnValueOnce('Test product');

        const resultFormatedProductName = await formatedProductName("test product");

        const mockProduct: IProduct = { _id: 'mock-id', name: resultFormatedProductName } as IProduct;
        (Product.findOne as jest.Mock).mockImplementationOnce(() => mockProduct);

        const result = await ProductServices.findProductByName(resultFormatedProductName);

        expect(formatedProductName).toHaveBeenCalledWith('test product');
        expect(Product.findOne as jest.Mock).toHaveBeenCalledWith({ name: 'Test product' });

        expect(result).toEqual({
            _id: 'mock-id',
            name: resultFormatedProductName
        });
    });

    it('should throw an error if product is not found', async () => {
        const formatedProductName = jest.fn().mockImplementation((productName: string) => {
            return productName;
        });
      // 1. Simuler le formatage
        (formatedProductName as jest.Mock).mockReturnValueOnce('Test product');

      // 2. Simuler qu'aucun produit n'est trouvé
        (Product.findOne as jest.Mock).mockResolvedValueOnce(null);

      // 3. Vérifier que la fonction jette une erreur
        await expect(ProductServices.findProductByName('dsc')).rejects.toThrow('produit introuvable');

    });
});