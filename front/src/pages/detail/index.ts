import { HeaderComponent } from '../../components/Header/HeaderComponent.js';
import { FooterComponent } from '../../components/Footer/FooterComponent.js';
import { DetailComponent } from '../../components/Detail/DetailComponent.js';

// TODO: 조금 더 함수형적으로 사고해보자
const urlParams = new URLSearchParams(window.location.search);
let product_id = 1;
const ex_id = urlParams.get('product_id');
if (ex_id != null) {
  product_id = parseInt(ex_id);
}

(async () => {
  // 웹 컴포넌트 등록
  customElements.define(HeaderComponent.componentName, HeaderComponent);
  customElements.define(FooterComponent.componentName, FooterComponent);
  customElements.define(DetailComponent.componentName, DetailComponent);
  const body_el = document.body;
  const header_component_el = new HeaderComponent();
  const footer_component_el = new FooterComponent();
  const detail_component_el = new DetailComponent(product_id);
  body_el.appendChild(header_component_el);
  body_el.appendChild(detail_component_el);
  body_el.appendChild(footer_component_el);
})()
  .then(() => {
    console.log('JS 스크립트 실행 완료');
  })
  .catch((error) => {
    console.error(error);
  });
