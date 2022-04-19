export class Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitInStock: number;
  dateCreated: Date;
  lastUpdated: Date;

  constructor(id: number, sku: string, name: string, description: string, unitPrice: number, imageUrl: string, active: boolean, unitInStock: number, dateCreated: Date, lastUpdated: Date) {
    this.id = id;
    this.sku = sku;
    this.name = name;
    this.description = description;
    this.unitPrice = unitPrice;
    this.imageUrl = imageUrl;
    this.active = active;
    this.unitInStock = unitInStock;
    this.dateCreated = dateCreated;
    this.lastUpdated = lastUpdated;
  }
}
