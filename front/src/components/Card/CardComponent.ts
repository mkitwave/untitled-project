import styl from './styl';
import { ProductType } from '../../models/product.interface';
import { filter, map, pipe, take, toArray } from '@fxts/core';
import { OptionPropertyType } from '../../models/detail.interface';
import {
  CartType,
  DetailedProductOptionPropertyType,
  DetailedProductType,
} from '../../models/cart.interface';
import join from '../../join';
import { CounterComponent } from '../Counter/CounterComponent';

export class CardComponent extends HTMLElement {
  private product_total_price: number[] = [];
  static get componentName() {
    return 'card-component';
  }
  get productTotalPrice() {
    return this.product_total_price;
  }
  constructor(
    cart: CartType,
    products: Array<ProductType>,
    option_properties: Array<OptionPropertyType>,
    detailed_products_option_properties: Array<DetailedProductOptionPropertyType>,
    detailed_products: Array<DetailedProductType>,
  ) {
    super();

    const getProductById = (product_id: number) =>
      pipe(
        products,
        filter((p) => p.product_id === product_id),
        take(1),
      ).next().value;

    const getProductByDetailedProductId = (detailed_product_id: number) =>
      getProductById(detailed_products[detailed_product_id - 1].product_id);

    const getOptionPropertyById = (option_property_id: number) =>
      pipe(
        option_properties,
        filter((p) => p.option_property_id === option_property_id),
        take(1),
      );

    const getDetailedProductOptionPropertyId = (detailed_product_id: number) =>
      pipe(
        detailed_products_option_properties,
        filter((d) => (d.detailed_product_id === detailed_product_id ? d : null)),
        map((d) => d.option_property_id),
        toArray,
      );

    const product: ProductType = getProductByDetailedProductId(cart.detailed_product_id);
    this.product_total_price.push(product.product_price * cart.cart_product_amount);
    const cardContent = `
      <div class="wrap">
        <div class="product-container">
          <div class="product">
            <div class="product-left">
              <a href="../detail?product_id=${product.product_id}" class="product-name">
                ${product.product_name}
              </a>
              <div class="product-option-property">
                ${pipe(
                  getDetailedProductOptionPropertyId(cart.detailed_product_id),
                  map((pp_id) => {
                    const option_property = getOptionPropertyById(pp_id).next().value;
                    product.product_price += option_property.option_property_additional_price;
                    return `${option_property.option_property_name}(+${option_property.option_property_additional_price})`;
                  }),
                  join(', '),
                )}
              </div>
            </div>
            <div class="product-right">
              <button value="delete" class='delete'>X</button>
              <div class="price">${product.product_price.toLocaleString('ko-KR')}</div>
            </div>
          </div>
          <div class="cart-product">
            <div class="amount-container" id=${cart.detailed_product_id}>
            ${cart.cart_product_amount}
            </div>
            <div class="product-total-price">
              ${(product.product_price * cart.cart_product_amount).toLocaleString('ko-KR')}
            </div>
          </div>
        </div>
      </div>
    `;

    const cardStyle = document.createElement('style');
    cardStyle.textContent = styl;
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = cardContent;
    shadowRoot.appendChild(cardStyle);
    customElements.get(CounterComponent.componentName) ||
      customElements.define(CounterComponent.componentName, CounterComponent);
    const amount_container_el = shadowRoot.querySelector('div.amount-container');
    amount_container_el?.replaceWith(new CounterComponent(+amount_container_el.innerHTML));
  }
}