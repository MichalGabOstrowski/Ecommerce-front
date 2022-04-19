import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  //!!!!!!!!!!!!!!!!!!!!!!!!bez wykrzyknika nie dziala
  products!: Product[];
  currentCategoryId!: number;
  currentCategoryName!: string;
  searchMode!: boolean;

  //Inject Product Service
  //route -> aktywna sciezka produktow
  constructor(private productService: ProductService,
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
    //  search for the products using keywords
    this.productService.searchProducts(theKeyWord).subscribe(
      data => {
        this.products = data;
      }
    )
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

    //wez produkty z servisu po z tym ID

    //metoda jest faktycznie wywolywana po subscribe
    this.productService.getProductList(this.currentCategoryId).subscribe(
      //  kiedy dane zostana zwrocone, mozemy je przypisac
      data => {
        this.products = data;
      }
    )
  }
}
