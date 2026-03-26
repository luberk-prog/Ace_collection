const API_URL = 'https://your-backend-url.onrender.com/api';

// --- Mobile Admin Menu ---
if (document.getElementById('adminHamburger')) {
  document.getElementById('adminHamburger').addEventListener('click', () => {
    document.getElementById('adminNav').classList.toggle('open');
  });
}
const closeMobileNav = () => {
  if (window.innerWidth <= 768 && document.getElementById('adminNav')) {
    document.getElementById('adminNav').classList.remove('open');
  }
};

// --- Login Logic ---
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        window.location.href = 'admin-dashboard.html';
      } else {
        document.getElementById('loginError').innerText = data.msg || 'Login failed';
      }
    } catch (err) {
      document.getElementById('loginError').innerText = 'Server error';
    }
  });
}

// --- Dashboard Logic ---
if (document.getElementById('productsTable')) {
  const token = localStorage.getItem('adminToken');
  if (!token) window.location.href = 'admin-login.html';

  // Navigation
  document.getElementById('navLogout').addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
  });

  const showSection = (id) => {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
  };

  document.getElementById('navProducts').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('viewProductsSection');
    e.target.classList.add('active');
    loadProducts();
    closeMobileNav();
  });

  document.getElementById('navAddProduct').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('addProductSection');
    e.target.classList.add('active');
    document.getElementById('productForm').reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('formTitle').innerText = 'Add Product';
    closeMobileNav();
  });

  // Load Products
  async function loadProducts() {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    console.log('Loaded products:', products);
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.img}" class="prod-img-preview" /></td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.price}</td>
        <td>
          <button class="action-btn edit" onclick="editProduct('${p._id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.category}')">Edit</button>
          <button class="action-btn delete" onclick="deleteProduct('${p._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // Add / Edit Product
  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;
    const category = document.getElementById('prodCategory').value;
    const imageFile = document.getElementById('prodImage').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    if (imageFile) formData.append('image', imageFile);

    const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;
    const method = id ? 'PUT' : 'POST';

    const btn = document.getElementById('saveProductBtn');
    btn.innerText = 'Saving...';
    btn.disabled = true;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert(id ? 'Product updated!' : 'Product added!');
        document.getElementById('navProducts').click();
      } else {
        alert('Error saving product');
      }
    } catch (err) {
      alert('Server error');
    } finally {
      btn.innerText = 'Save Product';
      btn.disabled = false;
    }
  });

  // Global functions for inline onclick handlers
  window.editProduct = (id, name, price, category) => {
    document.getElementById('navAddProduct').click();
    document.getElementById('formTitle').innerText = 'Edit Product';
    document.getElementById('editProductId').value = id;
    document.getElementById('prodName').value = name;
    document.getElementById('prodPrice').value = price;
    document.getElementById('prodCategory').value = (category || '').toLowerCase().trim();
  };

  window.deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadProducts();
      } else {
        alert('Error deleting product');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  // Init
  loadProducts();
}
