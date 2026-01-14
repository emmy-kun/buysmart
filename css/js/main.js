document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     HERO SLIDER (FIXED)
  ================================ */
  const slider = document.getElementById("heroSlider");
  const dots = document.querySelectorAll(".hero-indicators .dot");

  if (slider && dots.length > 0) {
    let currentIndex = 0;
    const totalSlides = dots.length;

    function updateSlider(index) {
      slider.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach(dot => dot.classList.remove("active"));
      dots[index].classList.add("active");
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider(currentIndex);
    }

    let autoSlide = setInterval(nextSlide, 5000);

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentIndex = index;
        updateSlider(currentIndex);
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 5000);
      });
    });

    updateSlider(0);
  }




  /* ===============================
     PRODUCT LOGIC (BOTH PAGES)
  ================================ */
  const productList = document.getElementById("productList");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resetBtn = document.getElementById("resetBtn");

  if (productList && typeof products !== "undefined") {

    let filteredProducts = [...products];

    function renderProducts(list) {
      productList.innerHTML = "";

      if (list.length === 0) {
        productList.innerHTML = "<p style='color:#aaa'>No products found.</p>";
        return;
      }

      list.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
          ${p.category ? `<span class="product-badge">${p.category}</span>` : ""}
          <img src="${p.image}" class="product-img" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="desc">${p.description}</p>
          <p class="price">₦${p.price.toLocaleString()}</p>
          <button>Add to Cart</button>
        `;

        productList.appendChild(div);
      });
    }

    function applyFilters() {
      filteredProducts = [...products];

      if (searchInput && searchInput.value.trim() !== "") {
        const query = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(query)
        );
      }

      if (categoryFilter && categoryFilter.value !== "all") {
        filteredProducts = filteredProducts.filter(
          p => p.category === categoryFilter.value
        );
      }

      if (sortFilter) {
        if (sortFilter.value === "price-low") {
          filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortFilter.value === "price-high") {
          filteredProducts.sort((a, b) => b.price - a.price);
        }
      }

      renderProducts(filteredProducts);
    }

    searchInput?.addEventListener("input", applyFilters);
    categoryFilter?.addEventListener("change", applyFilters);
    sortFilter?.addEventListener("change", applyFilters);

    resetBtn?.addEventListener("click", () => {
      searchInput.value = "";
      categoryFilter.value = "all";
      sortFilter.value = "default";
      filteredProducts = [...products];
      renderProducts(filteredProducts);
    });

    renderProducts(products);
  }

});
