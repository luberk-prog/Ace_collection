# ACE_COLLECTION (#ace your drip)

ACE_COLLECTION is a full-stack boutique e-commerce platform built to deliver a premium shopping experience. It features a modern, interactive frontend and a functional backend that handles product data, cart operations, and WhatsApp-based checkout.

---

## Overview

This platform allows users to browse fashion products, filter by category, add items to a cart, and place orders. The checkout process is streamlined by automatically sending order details to WhatsApp for quick processing.

The system is designed to be lightweight, fast, and easy to manage while maintaining a high-end fashion aesthetic.

---

## Features

### Frontend
- Interactive homepage with modern UI design
- Smooth animations and transitions
- Fully responsive layout (mobile and desktop)
- Fashion-focused, non-generic design

### Shop System
- Product grid display
- Category filtering:
  - Shirts
  - Pants
  - Shorts
  - Watches
  - Others
- Product cards with image, name, and price

### Smart Product Naming
- Product names are generated based on image content
- Ensures accurate, descriptive, and fashion-relevant naming

### Cart Functionality
- Add to cart
- Update quantities
- Real-time total price calculation

### Checkout System
- Customer enters name, phone number, and location
- Order details are formatted automatically
- User is redirected to WhatsApp with a pre-filled message containing:
  - Customer information
  - Selected products
  - Quantities
  - Total price

---

## Backend

The backend handles core application logic and communication between the frontend and external services.

### Key Responsibilities
- Serve product data
- Handle cart and checkout requests
- Generate WhatsApp order messages
- Validate user input

### API Endpoints

- `GET /products`  
  Returns all available products

- `POST /cart`  
  Handles cart data

- `POST /checkout`  
  Processes order and generates WhatsApp message

---

## Business Information

Brand Name: ACE_COLLECTION (#ace your drip)  
Location: Koforidua  
Phone: 0209142386  
WhatsApp: 0201941596  
Snapchat: @dhollarace  

Delivery Policy:  
We deliver nationwide. Deliveries outside Koforidua are done on Fridays.

---

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js

---

## Project Structure
ACE_COLLECTION/
│── frontend/
│ ├── index.html
│ ├── styles.css
│ ├── script.js
│
│── backend/
│ ├── server.js
│ ├── routes/
│ ├── controllers/
│ ├── data/
│
│── assets/
│ ├── images/
│ ├── logo/
│```
