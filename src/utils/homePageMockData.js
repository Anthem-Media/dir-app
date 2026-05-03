/**
 * Mock data for the HomePage slider rows.
 *
 * Structure:
 *   BOXES              — master catalogue of all box sets (defined once, referenced by ID)
 *                        Also exported so navMockData.js can reference the same objects.
 *   BRAND_SLIDER_CARDS — 14 brand cards for the By Brand slider row
 *   YEAR_SLIDER_CARDS  — 14 year cards (2026 → 2013) for the By Year slider row
 *   SLIDER_CATEGORIES  — ordered list of slider rows, each with a type and items array
 *
 * Navigation data (NAV_TABS, NAV_DROPDOWN_DATA) lives in navMockData.js.
 */

// ─── Master box catalogue ──────────────────────────────────────────────────
// Define each box once here. Slider rows reference boxes by ID via pick().
// Exported so navMockData.js can reference the same box objects without duplicating data.
// The id field (e.g. 'topps-chrome-2024-hobby') is also the URL slug for /box/:slug.

export const BOXES = {
  // ── Baseball ──────────────────────────────────────────────────────────────
  'topps-chrome-2024-hobby': {
    id: 'topps-chrome-2024-hobby',
    name: '2024 Topps Chrome Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 189.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2024/06/2024-Topps-Chrome-Baseball-Sealed-Hobby-box-thumb-1000.jpeg',
  },
  'topps-chrome-2024-blaster': {
    id: 'topps-chrome-2024-blaster',
    name: '2024 Topps Chrome Baseball Blaster',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Blaster',
    price: 29.99, imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_5be5f546-7038-4177-84d2-1be07fca4590',
  },
  'topps-series1-2024-hobby': {
    id: 'topps-series1-2024-hobby',
    name: '2024 Topps Series 1 Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 79.99, imageUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/69a11df34e483078adb256d6f907d2f7524f07cd_blob.png?v=1770884070',
  },
  'topps-series2-2024-hobby': {
    id: 'topps-series2-2024-hobby',
    name: '2024 Topps Series 2 Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 79.99, imageUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/e4d0d1942e8116534d62d7981f819b5ba3c59155_blob.png?v=1770883953',
  },
  'bowman-2024-hobby': {
    id: 'bowman-2024-hobby',
    name: '2024 Bowman Baseball',
    sport: 'Baseball', manufacturer: 'Bowman', year: 2024, format: 'Hobby',
    price: 119.99, imageUrl: 'https://m.media-amazon.com/images/I/71AX6O3S7uL._AC_UF894,1000_QL80_.jpg',
  },
  'bowman-chrome-2024-jumbo': {
    id: 'bowman-chrome-2024-jumbo',
    name: '2024 Bowman Chrome Baseball Jumbo',
    sport: 'Baseball', manufacturer: 'Bowman', year: 2024, format: 'Jumbo',
    price: 299.99, imageUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/2d413862c80f0dbe0d9b8e2857fbe8762110dd51_blob.png?v=1770884174',
  },
  'bowman-draft-2024-hobby': {
    id: 'bowman-draft-2024-hobby',
    name: '2024 Bowman Draft Baseball',
    sport: 'Baseball', manufacturer: 'Bowman', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/b6045f824544bd0157484b99eb031bd519f646f8_blob.png?v=1770884027',
  },
  'topps-heritage-2024-hobby': {
    id: 'topps-heritage-2024-hobby',
    name: '2024 Topps Heritage Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 109.99, imageUrl: 'https://m.media-amazon.com/images/I/81Un4ZD-gcL._AC_UF894,1000_QL80_.jpg',
  },
  'topps-stadium-club-2024-hobby': {
    id: 'topps-stadium-club-2024-hobby',
    name: '2024 Topps Stadium Club Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 139.99, imageUrl: 'https://m.media-amazon.com/images/I/71+hpEFTVvL._UF894,1000_QL80_.jpg',
  },
  'topps-finest-2024-hobby': {
    id: 'topps-finest-2024-hobby',
    name: '2024 Topps Finest Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 199.99, imageUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/bdf2efca144f154b353391c266c821591b9a4c45_blob.png?v=1770883523',
  },
  'topps-museum-2024-hobby': {
    id: 'topps-museum-2024-hobby',
    name: '2024 Topps Museum Collection Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 269.99, imageUrl: 'https://img.beckett.com/news/news-content/uploads/2024/07/2024-Topps-Museum-Collection-Baseball-Hobby-Box.jpg',
  },
  'topps-allen-ginter-2024-hobby': {
    id: 'topps-allen-ginter-2024-hobby',
    name: '2024 Topps Allen & Ginter Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 99.99, imageUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/c9cd5bd9fe62ee633a81f373abfca56b8002836b_blob.png?v=1770884000',
  },
  'topps-tier-one-2024-hobby': {
    id: 'topps-tier-one-2024-hobby',
    name: '2024 Topps Tier One Baseball',
    sport: 'Baseball', manufacturer: 'Topps', year: 2024, format: 'Hobby',
    price: 219.99, imageUrl: 'https://cdn.shopify.com/s/files/1/0662/9749/5709/files/311c4d71a73907271906703329eb872b0a7a6b66_blob.png?v=1770883918',
  },
  'panini-prizm-baseball-2024-hobby': {
    id: 'panini-prizm-baseball-2024-hobby',
    name: '2024 Panini Prizm Baseball',
    sport: 'Baseball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 229.99, imageUrl: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/09b9c73b-6592-4be3-97ee-c9760217960c.jpg',
  },

  // ── Football ──────────────────────────────────────────────────────────────
  'panini-prizm-football-2024-hobby': {
    id: 'panini-prizm-football-2024-hobby',
    name: '2024 Panini Prizm Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 299.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2024/12/2024-Panini-Prizm-Football-Sealed-Hobby-box-thumb-850.jpg',
  },
  'panini-select-football-2024-hobby': {
    id: 'panini-select-football-2024-hobby',
    name: '2024 Panini Select Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 199.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2025/05/2024-Panini-Select-Football-Sealed-Hobby-box-new.jpg',
  },
  'panini-mosaic-football-2024-hobby': {
    id: 'panini-mosaic-football-2024-hobby',
    name: '2024 Panini Mosaic Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2024/11/2024-Panini-Mosaic-Football-Sealed-Hobby-box-thumb-1000-new.jpg',
  },
  'panini-donruss-football-2024-hobby': {
    id: 'panini-donruss-football-2024-hobby',
    name: '2024 Panini Donruss Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 79.99, imageUrl: 'https://m.media-amazon.com/images/I/718dSSQ3shL.jpg',
  },
  'panini-contenders-football-2024-hobby': {
    id: 'panini-contenders-football-2024-hobby',
    name: '2024 Panini Contenders Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_0f791ec2-27d2-4558-96dc-f11f619bf296',
  },
  'panini-chronicles-football-2024-hobby': {
    id: 'panini-chronicles-football-2024-hobby',
    name: '2024 Panini Chronicles Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 89.99, imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/61EGlom+jJL._AC_UL495_SR435,495_.jpg',
  },
  'panini-absolute-football-2024-hobby': {
    id: 'panini-absolute-football-2024-hobby',
    name: '2024 Panini Absolute Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 99.99, imageUrl: 'https://i5.walmartimages.com/seo/2024-Panini-Absolute-Football-NFL-Trading-Cards-Blaster-Box_4892a8cc-2f96-499c-82ea-695c0ec68e2f.889e571c1942ca590ec00fcca9aaf4fc.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
  },
  'panini-score-football-2024-hobby': {
    id: 'panini-score-football-2024-hobby',
    name: '2024 Panini Score Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 49.99, imageUrl: 'https://m.media-amazon.com/images/I/71nDvu1I17L._AC_UF894,1000_QL80_.jpg',
  },
  'panini-spectra-football-2024-hobby': {
    id: 'panini-spectra-football-2024-hobby',
    name: '2024 Panini Spectra Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 299.99, imageUrl: 'https://burbankcards.com/cdn/shop/files/1234_23.png?v=1740177803&width=1080',
  },
  'panini-immaculate-football-2024-hobby': {
    id: 'panini-immaculate-football-2024-hobby',
    name: '2024 Panini Immaculate Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 499.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2025/08/2024-Panini-Immaculate-Collection-Football-Sealed-Hobby-box.jpeg',
  },
  'panini-nt-football-2024-hobby': {
    id: 'panini-nt-football-2024-hobby',
    name: '2024 Panini National Treasures Football',
    sport: 'Football', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 799.99, imageUrl: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2025/08/24_national_treasures_fb_hobbyfotl.png',
  },
  'panini-prizm-football-2023-hobby': {
    id: 'panini-prizm-football-2023-hobby',
    name: '2023 Panini Prizm Football',
    sport: 'Football', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 249.99, imageUrl: 'https://m.media-amazon.com/images/I/81eigpvOMRL.jpg',
  },
  'panini-select-football-2023-hobby': {
    id: 'panini-select-football-2023-hobby',
    name: '2023 Panini Select Football',
    sport: 'Football', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 169.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2025/05/2024-Panini-Select-Football-Sealed-Hobby-box-new.jpg',
  },
  'panini-mosaic-football-2023-hobby': {
    id: 'panini-mosaic-football-2023-hobby',
    name: '2023 Panini Mosaic Football',
    sport: 'Football', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 119.99, imageUrl: 'https://m.media-amazon.com/images/I/61CrkjmYRiL.jpg',
  },

  // ── Basketball ────────────────────────────────────────────────────────────
  'panini-prizm-bball-2425-hobby': {
    id: 'panini-prizm-bball-2425-hobby',
    name: '2024-25 Panini Prizm Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 349.99, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRba3AqMeTicX1ZwT_WIdWG4XfQjCSGw8TWWQ&s',
  },
  'panini-select-bball-2425-hobby': {
    id: 'panini-select-bball-2425-hobby',
    name: '2024-25 Panini Select Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 249.99, imageUrl: 'https://img.beckett.com/news/news-content/uploads/2025/05/2024-25-Panini-Select-Basketball-Hobby-Box.jpg',
  },
  'panini-hoops-bball-2425-hobby': {
    id: 'panini-hoops-bball-2425-hobby',
    name: '2024-25 Panini Hoops Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 89.99, imageUrl: 'https://m.media-amazon.com/images/I/61k46bxJelL._UF894,1000_QL80_.jpg',
  },
  'panini-chronicles-bball-2425-hobby': {
    id: 'panini-chronicles-bball-2425-hobby',
    name: '2024-25 Panini Chronicles Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 129.99, imageUrl: 'https://tools.toywiz.com/_images/_webp/_products/lg/2021chroniclesnbacereal.webp',
  },
  'panini-mosaic-bball-2425-hobby': {
    id: 'panini-mosaic-bball-2425-hobby',
    name: '2024-25 Panini Mosaic Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 179.99, imageUrl: 'https://allstarsportscards.com/cdn/shop/files/panini-24-25-mosaic-box.jpg?v=1757714287&width=1080',
  },
  'panini-donruss-bball-2425-hobby': {
    id: 'panini-donruss-bball-2425-hobby',
    name: '2024-25 Panini Donruss Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 79.99, imageUrl: 'https://media.gamestop.com/i/gamestop/20018520/2024-25-Panini-Donruss-NBA-Basketball-Blaster-Box?w=768&h=768&fmt=auto',
  },
  'panini-court-kings-bball-2425-hobby': {
    id: 'panini-court-kings-bball-2425-hobby',
    name: '2024-25 Panini Court Kings Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2025/02/2024-25-Panini-Court-Kings-Basketball-Sealed-Hobby-box-thumb-1000.jpg',
  },
  'panini-noir-bball-2425-hobby': {
    id: 'panini-noir-bball-2425-hobby',
    name: '2024-25 Panini Noir Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 499.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2025/07/2024-25-Panini-Noir-Basketball-Sealed-Hobby-box-thumb-1000-new.jpeg',
  },
  'panini-immaculate-bball-2425-hobby': {
    id: 'panini-immaculate-bball-2425-hobby',
    name: '2024-25 Panini Immaculate Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 599.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2025/08/2024-25-Panini-Immaculate-Collection-Basketball-Sealed-Hobby-box-tin-1000.jpeg',
  },
  'panini-nt-bball-2425-hobby': {
    id: 'panini-nt-bball-2425-hobby',
    name: '2024-25 Panini National Treasures Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 999.99, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNSZ9vElp97oYVqg0g_XEHUqLB1u-00Gdfbg&s',
  },
  'panini-flawless-bball-2425-hobby': {
    id: 'panini-flawless-bball-2425-hobby',
    name: '2024-25 Panini Flawless Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2024, format: 'Hobby',
    price: 1299.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2025/08/2024-25-Panini-Flawless-Basketball-Sealed-Hobby-box-briefcase.jpeg',
  },
  'panini-prizm-bball-2324-hobby': {
    id: 'panini-prizm-bball-2324-hobby',
    name: '2023-24 Panini Prizm Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 299.99, imageUrl: 'https://ausumsports.com/cdn/shop/files/2324PRIZBLBX.jpg?v=1726609553&width=1445',
  },
  'panini-select-bball-2324-hobby': {
    id: 'panini-select-bball-2324-hobby',
    name: '2023-24 Panini Select Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 219.99, imageUrl: 'https://ausumsports.com/cdn/shop/files/2324SELECTBL.jpg?v=1726607372&width=416',
  },
  'panini-hoops-bball-2324-hobby': {
    id: 'panini-hoops-bball-2324-hobby',
    name: '2023-24 Panini Hoops Basketball',
    sport: 'Basketball', manufacturer: 'Panini', year: 2023, format: 'Hobby',
    price: 79.99, imageUrl: 'https://i5.walmartimages.com/seo/2023-24-Panini-NBA-HOOPS-Basketball-24-Pack-Retail-Box_7fea9270-2a19-41c4-b07e-14f05d7f1c4e.1ee9d85cb8e35edde5a1271073ddc540.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
  },

  // ── Hockey ────────────────────────────────────────────────────────────────
  'ud-series1-hockey-2425-hobby': {
    id: 'ud-series1-hockey-2425-hobby',
    name: '2024-25 Upper Deck Series 1 Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 139.99, imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_5cc2a52a-0a36-4d65-adce-5bc35ba6e29d',
  },
  'ud-series2-hockey-2425-hobby': {
    id: 'ud-series2-hockey-2425-hobby',
    name: '2024-25 Upper Deck Series 2 Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 139.99, imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_5ffcc3f5-f941-46fe-9b7d-3a210d3ba974?wid=300&hei=300&fmt=pjpeg',
  },
  'ud-mvp-hockey-2425-hobby': {
    id: 'ud-mvp-hockey-2425-hobby',
    name: '2024-25 Upper Deck MVP Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 89.99, imageUrl: 'https://upperdeckstore.com/media/catalog/product/2/4/24-25-mvp-box-retail-sb342.jpg?optimize=high&fit=bounds&height=570&width=570&canvas=570:570',
  },
  'ud-ice-hockey-2425-hobby': {
    id: 'ud-ice-hockey-2425-hobby',
    name: '2024-25 Upper Deck Ice Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 299.99, imageUrl: 'https://assets.dacw.co/itemimages/886023_004_061025.jpg',
  },
  'ud-black-diamond-hockey-2425-hobby': {
    id: 'ud-black-diamond-hockey-2425-hobby',
    name: '2024-25 Upper Deck Black Diamond Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 399.99, imageUrl: 'https://www.waynessportscards.com/wp-content/uploads/2025/01/black-diamond.jpg',
  },
  'ud-sp-authentic-hockey-2425-hobby': {
    id: 'ud-sp-authentic-hockey-2425-hobby',
    name: '2024-25 Upper Deck SP Authentic Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 219.99, imageUrl: 'https://upperdeck.com/wp-content/uploads/2025/02/24-25-SP-Box-Blaster-UD282.png',
  },
  'ud-opc-hockey-2425-hobby': {
    id: 'ud-opc-hockey-2425-hobby',
    name: '2024-25 Upper Deck O-Pee-Chee Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 109.99, imageUrl: 'https://www.nw-sportscards.com/cdn/shop/files/opcblaster_580x.webp?v=1741228562',
  },
  'ud-allure-hockey-2425-hobby': {
    id: 'ud-allure-hockey-2425-hobby',
    name: '2024-25 Upper Deck Allure Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 179.99, imageUrl: 'https://target.scene7.com/is/image/Target/GUEST_30513f44-427d-4894-8ad2-f33407a616d5?wid=300&hei=300&fmt=pjpeg',
  },
  'ud-artifacts-hockey-2425-hobby': {
    id: 'ud-artifacts-hockey-2425-hobby',
    name: '2024-25 Upper Deck Artifacts Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 199.99, imageUrl: 'https://m.media-amazon.com/images/I/613i+c3cnfL.jpg',
  },
  'ud-parkhurst-hockey-2425-hobby': {
    id: 'ud-parkhurst-hockey-2425-hobby',
    name: '2024-25 Upper Deck Parkhurst Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 99.99, imageUrl: 'https://dacardworld1.imgix.net/872067_004_061925.jpg?auto=format%2Ccompress&fm=jpg&h=1800&ixlib=php-3.3.1&w=1800&s=c5f8506c5c5e810a61195db5b609b0d8',
  },
  'skybox-metal-hockey-2425-hobby': {
    id: 'skybox-metal-hockey-2425-hobby',
    name: '2024-25 Skybox Metal Universe Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 189.99, imageUrl: 'https://dacardworld1.imgix.net/868938_004_051325.jpg?auto=format%2Ccompress&fm=jpg&h=1800&ixlib=php-3.3.1&w=1800&s=ee17b02a848db40465a4d604cc37e6d6',
  },
  'ud-series1-hockey-2324-hobby': {
    id: 'ud-series1-hockey-2324-hobby',
    name: '2023-24 Upper Deck Series 1 Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2023, format: 'Hobby',
    price: 129.99, imageUrl: 'https://m.media-amazon.com/images/I/71XrK6LbqNL.jpg',
  },
  'ud-ice-hockey-2324-hobby': {
    id: 'ud-ice-hockey-2324-hobby',
    name: '2023-24 Upper Deck Ice Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2023, format: 'Hobby',
    price: 269.99, imageUrl: 'https://xcdn.checklistinsider.com/public/2024/04/2023-24-Upper-Deck-Ice-Hockey-Sealed-Hobby-box-thumb-1000.jpeg',
  },
  'ud-canvas-hockey-2425-hobby': {
    id: 'ud-canvas-hockey-2425-hobby',
    name: '2024-25 Upper Deck UD Canvas Hockey',
    sport: 'Hockey', manufacturer: 'Upper Deck', year: 2024, format: 'Hobby',
    price: 149.99, imageUrl: 'https://cconnect.s3.amazonaws.com/wp-content/uploads/2024/11/Screenshot-2024-11-29-133306.png',
  },
};

// Helper: pull an ordered array of boxes from the master catalogue by ID
function pick(...ids) {
  return ids.map((id) => BOXES[id]);
}

// ─── Brand slider cards ────────────────────────────────────────────────────
// Used by the "By Brand" slider row. No price — the card just shows the brand name.

export const BRAND_SLIDER_CARDS = [
  { id: 'brand-topps',       name: 'Topps',       imageUrl: null },
  { id: 'brand-panini',      name: 'Panini',      imageUrl: null },
  { id: 'brand-bowman',      name: 'Bowman',      imageUrl: null },
  { id: 'brand-upper-deck',  name: 'Upper Deck',  imageUrl: null },
  { id: 'brand-donruss',     name: 'Donruss',     imageUrl: null },
  { id: 'brand-select',      name: 'Select',      imageUrl: null },
  { id: 'brand-prizm',       name: 'Prizm',       imageUrl: null },
  { id: 'brand-mosaic',      name: 'Mosaic',      imageUrl: null },
  { id: 'brand-fleer',       name: 'Fleer',       imageUrl: null },
  { id: 'brand-score',       name: 'Score',       imageUrl: null },
  { id: 'brand-leaf',        name: 'Leaf',        imageUrl: null },
  { id: 'brand-skybox',      name: 'Skybox',      imageUrl: null },
  { id: 'brand-hoops',       name: 'Hoops',       imageUrl: null },
  { id: 'brand-pacific',     name: 'Pacific',     imageUrl: null },
];

// ─── Year slider cards ─────────────────────────────────────────────────────
// Used by the "By Year" slider row. Just a year number — no name, no price.
// Counts backwards from 2026 to 2013 (14 years total).

export const YEAR_SLIDER_CARDS = Array.from({ length: 14 }, (_, i) => {
  const year = 2026 - i;
  return { id: `year-${year}`, year };
});

// ─── Slider category definitions ───────────────────────────────────────────
// Each category becomes one horizontal slider row on the HomePage.
//
// type: 'box'   → items are box objects → rendered by BoxSliderCard
// type: 'brand' → items are brand objects → rendered by BrandSliderCard
// type: 'year'  → items are year objects → rendered by YearSliderCard

export const SLIDER_CATEGORIES = [
  {
    id: 'featured',
    type: 'box',
    label: 'Featured',
    subtitle: 'Handpicked box sets across all sports.',
    items: pick(
      'topps-chrome-2024-hobby',
      'panini-prizm-football-2024-hobby',
      'panini-prizm-bball-2425-hobby',
      'ud-ice-hockey-2425-hobby',
      'bowman-chrome-2024-jumbo',
      'panini-select-football-2024-hobby',
      'panini-noir-bball-2425-hobby',
      'ud-black-diamond-hockey-2425-hobby',
      'topps-museum-2024-hobby',
      'panini-nt-football-2024-hobby',
      'panini-flawless-bball-2425-hobby',
      'topps-tier-one-2024-hobby',
      'panini-immaculate-football-2024-hobby',
      'panini-nt-bball-2425-hobby',
    ),
  },
  {
    id: 'trending',
    type: 'box',
    label: 'Trending',
    subtitle: 'Most viewed box sets this week.',
    items: pick(
      'panini-prizm-football-2024-hobby',
      'topps-chrome-2024-hobby',
      'panini-prizm-bball-2425-hobby',
      'bowman-chrome-2024-jumbo',
      'ud-black-diamond-hockey-2425-hobby',
      'panini-select-football-2024-hobby',
      'panini-mosaic-football-2024-hobby',
      'topps-finest-2024-hobby',
      'panini-select-bball-2425-hobby',
      'ud-sp-authentic-hockey-2425-hobby',
      'topps-museum-2024-hobby',
      'panini-chronicles-bball-2425-hobby',
      'bowman-draft-2024-hobby',
      'panini-contenders-football-2024-hobby',
    ),
  },
  {
    id: 'by-brand',
    type: 'brand',
    label: 'By Brand',
    subtitle: 'Browse by manufacturer.',
    items: BRAND_SLIDER_CARDS,
  },
  {
    id: 'by-year',
    type: 'year',
    label: 'By Year',
    subtitle: 'Browse releases by year.',
    items: YEAR_SLIDER_CARDS,
  },
  {
    id: 'baseball',
    type: 'box',
    label: 'Baseball',
    subtitle: 'The full baseball catalogue.',
    items: pick(
      'topps-chrome-2024-hobby',
      'bowman-chrome-2024-jumbo',
      'topps-series1-2024-hobby',
      'bowman-2024-hobby',
      'topps-finest-2024-hobby',
      'topps-museum-2024-hobby',
      'panini-prizm-baseball-2024-hobby',
      'topps-tier-one-2024-hobby',
      'topps-stadium-club-2024-hobby',
      'topps-heritage-2024-hobby',
      'bowman-draft-2024-hobby',
      'topps-allen-ginter-2024-hobby',
      'topps-series2-2024-hobby',
      'topps-chrome-2024-blaster',
    ),
  },
  {
    id: 'football',
    type: 'box',
    label: 'Football',
    subtitle: 'The full football catalogue.',
    items: pick(
      'panini-prizm-football-2024-hobby',
      'panini-nt-football-2024-hobby',
      'panini-immaculate-football-2024-hobby',
      'panini-spectra-football-2024-hobby',
      'panini-select-football-2024-hobby',
      'panini-mosaic-football-2024-hobby',
      'panini-contenders-football-2024-hobby',
      'panini-absolute-football-2024-hobby',
      'panini-chronicles-football-2024-hobby',
      'panini-donruss-football-2024-hobby',
      'panini-score-football-2024-hobby',
      'panini-prizm-football-2023-hobby',
      'panini-select-football-2023-hobby',
      'panini-mosaic-football-2023-hobby',
    ),
  },
  {
    id: 'basketball',
    type: 'box',
    label: 'Basketball',
    subtitle: 'The full basketball catalogue.',
    items: pick(
      'panini-flawless-bball-2425-hobby',
      'panini-nt-bball-2425-hobby',
      'panini-immaculate-bball-2425-hobby',
      'panini-noir-bball-2425-hobby',
      'panini-prizm-bball-2425-hobby',
      'panini-select-bball-2425-hobby',
      'panini-mosaic-bball-2425-hobby',
      'panini-court-kings-bball-2425-hobby',
      'panini-chronicles-bball-2425-hobby',
      'panini-hoops-bball-2425-hobby',
      'panini-donruss-bball-2425-hobby',
      'panini-prizm-bball-2324-hobby',
      'panini-select-bball-2324-hobby',
      'panini-hoops-bball-2324-hobby',
    ),
  },
  {
    id: 'hockey',
    type: 'box',
    label: 'Hockey',
    subtitle: 'The full hockey catalogue.',
    items: pick(
      'ud-black-diamond-hockey-2425-hobby',
      'ud-ice-hockey-2425-hobby',
      'ud-sp-authentic-hockey-2425-hobby',
      'skybox-metal-hockey-2425-hobby',
      'ud-artifacts-hockey-2425-hobby',
      'ud-allure-hockey-2425-hobby',
      'ud-canvas-hockey-2425-hobby',
      'ud-series1-hockey-2425-hobby',
      'ud-series2-hockey-2425-hobby',
      'ud-parkhurst-hockey-2425-hobby',
      'ud-opc-hockey-2425-hobby',
      'ud-mvp-hockey-2425-hobby',
      'ud-ice-hockey-2324-hobby',
      'ud-series1-hockey-2324-hobby',
    ),
  },
];

// NAV_TABS and NAV_DROPDOWN_DATA live in src/utils/navMockData.js
