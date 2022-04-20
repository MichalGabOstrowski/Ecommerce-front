import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  //Inject Product Service
  //route -> aktywna sciezka produktow
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }


  //similar method to @PostConstruct
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    })
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  private handleSearchProducts() {

    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;
    //if we have a different keyword then previous
    //then set thePageNumber to 1
    if (this.previousKeyword != theKeyWord) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyWord;

    console.log(`keyword=${theKeyWord}, thePageNumber=${this.thePageNumber}`)

    //  search for the products using keywords
    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyWord)
      .subscribe(this.processResult())
  }

  handleListProducts() {
    //check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    //route -> use the activated route
    //snapshot -> stan sciezki w tym okreslonym momencie
    //paramMap ->mapuj wszystkie parametry sciezki, ktore maja id
    //'id' -> routerLink in [app.component.html] , route: path - category id -> [app.modules]

    if (hasCategoryId) {
      //parametr jest zwracany jako String a '+' convertuje to na Number
      //! as a special syntax for null?!
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      //category id is not available -> set default category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    //
    //check if we have a different category than previous
    //Angular will reuse a component if it is currently being used
    //

    //if we have a different category id then previous
    //then set thePageNumber back to 1

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    //wez produkty z servisu po z tym ID
    //in Angular page are 1 based, but in Spring Data REST pages are 0 based
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.processResult());
    //metoda jest faktycznie wywolywana po subscribe
    //  kiedy dane zostana zwrocone, mozemy je przypisac

  }


  //Left Side: properties defined in class
  //Right Side: data from SPRING DATA REST JSON
  processResult() {

    //!!!!!!!!!!!!!!!!!bez Ts ignore nie dziala
    // @ts-ignore
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
