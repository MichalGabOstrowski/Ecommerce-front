import {Component, OnInit} from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {


  //created new instance of Product
  // @ts-ignore
  product: Product = new Product();


  constructor(private productService: ProductService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }

  private handleProductDetails() {
    //  get the "id" param string. Convert String to a number using the "+" symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;


    //HTML template file is attempting to access property:
    //product.imageUrl
    //but product is not assign yet

    //Property is not assigned until data arrives from the ProductService method call
    //W have to create new instance of Product ();
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }
}
