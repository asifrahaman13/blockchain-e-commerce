/**
 *Submitted for verification at Etherscan.io on 2023-01-22
*/

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract EthCart{

    address private Owner;

    struct BuyersPanDetails{
        string name;
        uint invoiceAmount;
        uint invoiceDate;
        address transactionFrom;
        string ProductDescription;
    }

    struct SellersPanDetails{
        string name;
        uint invoiceAmount;
        uint invoiceDate;
        string ProductDescription;
    }
     struct Product_Details{ 
        address Product_Owner;
        string Product_Name;
        string Product_Description;
        uint256 Product_Price;
        string product_id;
    }
    struct Product_Status{
        address Buyer_Owner; 
        status Status;
        uint Time_Lock;
    }

    mapping(address => string[]) private productsSoldBySeller;
    mapping(address => string[]) private productsBoughtByBuyer;


    event Product_register(address indexed Product_Owner,string Product_Id, uint Product_Price);
    event Product_Buy(address indexed Product_Buyer,string Product_Id, uint Product_Price );
    event LogDelievered(string productId, bool sold);

    error InsufficientBalance(uint256 available, uint256 required);
    error Unauthorized(string reason); 

    Product_Details[] private p;

    address[] private buyers;
    address[] private sellers;
    BuyersPanDetails[] private b;
    SellersPanDetails[] private s;

    
    enum status {available,ordered,cancelled, paid,sold}

    mapping(address=>bool) private deliveryAgent;
    mapping (string=>BuyersPanDetails[]) private BuyersPanMapping;
    mapping (string=>SellersPanDetails[]) private SellersPanMapping;
    mapping(address=>mapping (string=>Product_Details)) private ProductDetails;
    mapping(string=>Product_Status) public ProductStatus;
    mapping(string=>address) private product_Owner;
    mapping(string=>uint ) private PriceOfProduct;
    mapping (string=>string) private ProductDescription;
    mapping(string=>bool) private ProductID;
    mapping(address=>bool) private unique;
    mapping(string=>address) private sellersPAN;
    mapping(string=>address) private buyersPAN;

    constructor(){
        Owner=msg.sender;
    }


    modifier OnlyOwner(){
        require(msg.sender==Owner,"only owner can access function");
        _;
    }

    modifier OnlyDeliveryAgent(){
        require(deliveryAgent[msg.sender]==true,"only DeleveryAgent can access function");
        _;
    }

    function DetailsFromPan(string memory _s) public view returns(BuyersPanDetails[] memory){
         return BuyersPanMapping[_s];
    }

    function SellersDetails(string memory _s) public view returns(SellersPanDetails[] memory){
        return SellersPanMapping[_s];
    }

    function TotalProducts() public view returns(uint){
        return p.length;
    }

    function TotalBuyers() public view returns(uint){
        return buyers.length;
    }

    function TotalSellers() public view returns(uint){
        return sellers.length;
    }

    function AvailableProducts() public view returns(Product_Details[] memory){
        return p;
    }

    function ProductsDetails(string memory _productid) public  view returns(Product_Details memory){
       return ProductDetails[product_Owner[_productid]][_productid];
    }

    function Submit(string memory _name,string memory _sellers_pan,string memory _product_name,string memory _product_description,uint256 _product_price,string memory _product_id) public {
        require(sellersPAN[_sellers_pan]==msg.sender || sellersPAN[_sellers_pan]==address(0) );
        require(ProductID[_product_id]==false,"Product Id already taken");
        require(bytes(_sellers_pan).length==12,"The pan length should be 12 digit");
        ProductID[_product_id]=true;
        SellersPanMapping[_sellers_pan].push(SellersPanDetails({
            name:_name,
            invoiceAmount: _product_price,
            invoiceDate: block.timestamp,
            ProductDescription:_product_description
        }));
        p.push(Product_Details({
             Product_Owner:msg.sender,
             Product_Name:_product_name,
             Product_Description:_product_description,
              Product_Price:_product_price,
              product_id:_product_id
        }));
        
        ProductDetails[msg.sender][_product_id]=Product_Details(msg.sender,_product_name,_product_description,_product_price,_product_id);
        product_Owner[_product_id]=msg.sender;
        PriceOfProduct[_product_id]=_product_price;
        ProductDescription[_product_id]=_product_description;

        ProductStatus[_product_id]=Product_Status(msg.sender,status.available,block.timestamp);
        productsSoldBySeller[msg.sender].push(_product_id);
        
        emit Product_register(msg.sender, _product_id, _product_price);
        if(unique[msg.sender]!=true){
            sellers.push(msg.sender);
            unique[msg.sender]=true;
        }
        sellersPAN[_sellers_pan]=msg.sender;

    }

    function Buy(string memory _product_id,string memory _buyers_pan,string memory _name) public  {
        require(buyersPAN[_buyers_pan]==msg.sender || buyersPAN[_buyers_pan]==address(0));
        require(ProductStatus[_product_id].Status==status.available,"product is not available");
        require(bytes(_buyers_pan).length==12,"The pan length should be 12 digit");
        
        BuyersPanMapping[_buyers_pan].push(BuyersPanDetails({
            name:_name,
            invoiceAmount: PriceOfProduct[_product_id],
            invoiceDate: block.timestamp,
            transactionFrom:product_Owner[_product_id],
            ProductDescription:ProductDescription[_product_id]
        }));

        buyers.push(msg.sender);

        ProductStatus[_product_id]=Product_Status(msg.sender,status.ordered,block.timestamp);
        buyersPAN[_buyers_pan]=msg.sender;
        productsBoughtByBuyer[msg.sender].push(_product_id);
        emit Product_Buy(msg.sender, _product_id, PriceOfProduct[_product_id]);
    }

    function track_Status(string memory _product_id) public  view returns(Product_Status memory) {
        require(ProductID[_product_id]==true);
        return  ProductStatus[_product_id];

    }

    function cancel(string memory _product_id) public {
        require(msg.sender==ProductStatus[_product_id].Buyer_Owner,"Owner UnAthorised:");
        require(ProductStatus[_product_id].Status==status.ordered,"product is not available");
        ProductStatus[_product_id]=Product_Status(address(0x0),status.available,0);
    }

    function AmountPaid(string memory _product_id)public OnlyDeliveryAgent{
        require(ProductStatus[_product_id].Status==status.ordered,"product is not available");
        ProductStatus[_product_id].Status=status.paid;
    }

    function delivered(string memory _product_id) public OnlyDeliveryAgent{
        require(ProductStatus[_product_id].Status==status.paid,"product is not paid yet");
        ProductStatus[_product_id].Status=status.sold;
        emit LogDelievered(_product_id,true);
        deliveryAgent[msg.sender]=false;
    }

    function AddDeleveryAgent(address _delivery_agent)public OnlyOwner{
        deliveryAgent[_delivery_agent]=true;
    }
    address[] private subscribers;
    uint total_subsribers=subscribers.length;
    mapping(address=>bool) subscibed;

    modifier alreadySubscibed(){
        require(subscibed[msg.sender]!=true,"You are already subscribed to our website");
        _;
    }

    function subscibe()public alreadySubscibed{
       subscribers.push(msg.sender);
       subscibed[msg.sender]=true;
    }

    function showSubscribers()public view returns(address[] memory){
        return subscribers;
    }


    function GetProductsSoldBySeller(address _sellers_address) public view returns (string[] memory) {
        return productsSoldBySeller[_sellers_address];
    }

    function GetProductsBoughtByBuyer(address _buyers_address) public view returns (string[] memory) {
        return productsBoughtByBuyer[_buyers_address];
    }
}

