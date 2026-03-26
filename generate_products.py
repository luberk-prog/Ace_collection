import json
import os

def generate_products():
    """Generates products.json with accurate names, categories and prices."""
    
    products = []
    
    # Range of IDs (1-144)
    # The workspace has photo_1 to photo_98 with 21-03-00 (Batch 1)
    # and photo_1 to photo_46 with 21-03-29 (Batch 2)
    # Total = 98 + 46 = 144
    
    # ---------------------------------------------------------
    # BATCH 1 (00 timestamp) - IDs 1-98
    # ---------------------------------------------------------
    for i in range(1, 99):
        filename = f"photo_{i}_2026-03-19_21-03-00.jpg"
        
        # Default values
        name = f"ACE Premium Item {i}"
        category = "others"
        price = 120
        
        # Categorization logic
        if i in range(1, 14):
            category = "shirts"
            price = 95
            names = {
                1: "Black Knight Graphic Tee",
                2: "Saintage Panel Polo",
                3: "Saintage Black Panel Polo",
                4: "Red Accent Saintage Polo",
                5: "Saintage Crest Black Polo",
                6: "Signature Graphic Black Tee",
                7: "Retro Sport Panel Polo",
                8: "Vantage Point Graphic Tee",
                9: "Royal Panel Polo Shirt",
                10: "Saintage Red Line Polo",
                11: "Saintage White Panel Polo",
                12: "Streetwear Graphic Tee",
                13: "Urban Flow Paneled Tee"
            }
            name = names.get(i, f"Vintage Designer Shirt {i}")
            
        elif i in range(14, 22):
            category = "pants"
            price = 140
            names = {
                14: "Classic Camo Cargo Pants",
                15: "Urban Desert Camo Cargo",
                16: "Midnight Camo Cargo",
                17: "Stealth Black Cargo Pants",
                18: "Forest Camo Cargo Pants",
                19: "Desert Storm Cargo",
                20: "Rugged Woodland Cargo",
                21: "Night Ops Camo Cargo"
            }
            name = names.get(i, f"Special Ops Cargo Pants {i}")
            
        elif i in range(22, 31):
            category = "shorts"
            price = 90
            names = {
                22: "Camo Utility Cargo Shorts",
                23: "Washed Olive Cargo Shorts",
                24: "Urban Desert Cargo Shorts",
                25: "Stealth Black Cargo Shorts",
                26: "Forest Green Cargo Shorts",
                27: "Khaki Expedition Shorts",
                28: "Midnight Camo Cargo Shorts",
                29: "Rugged Woodland Cargo Shorts",
                30: "Grey Urban Cargo Shorts"
            }
            name = names.get(i, f"Explorer Cargo Shorts {i}")

        elif i in range(31, 41):
            category = "shirts"
            price = 110
            names = {
                31: "SAGTIRAS Floral Flare Polo",
                32: "Orlando Magic Vintage Polo",
                33: "Valley Brand White Zip Polo",
                34: "Midnight Wavy Abstract Shirt",
                35: "Saintage Camo-Collar Polo",
                36: "White Saintage Camo-Collar Polo",
                37: "Green SAGTIRAS Floral Polo",
                38: "Pink SAGTIRAS Floral Polo",
                39: "Black Valley Zip Polo",
                40: "White Valley Zip Polo"
            }
            name = names.get(i, f"Designer Polo Type {i}")

        elif i == 41:
            category = "shirts"
            name = "Bronze Panel Designer Zip Shirt"
            price = 130
        
        elif i in range(42, 55):
            category = "hoodies"
            price = 110
            names = {
                42: "Elite Black '22' Hoodie",
                43: "Eagles Tribute Black Hoodie",
                44: "Pirated Studios Graphic Hoodie",
                45: "Top Performer Red Hoodie",
                46: "Premium Varsity '22' Hoodie",
                47: "Pirated Studios Red Graphic Hoodie",
                48: "Casio Triple Color Watch Set", # Case where multi-product in picture
                49: "Worldwide Statement Tan Hoodie",
                50: "Worldwide Statement Red Hoodie",
                51: "Life of the Party Red Hoodie",
                52: "Varsity '22' Tan Hoodie",
                53: "Pirated Studios Tan Graphic Hoodie",
                54: "Top Performer Black Hoodie"
            }
            name = names.get(i, f"Urban Statement Hoodie {i}")
            if i == 48: category = "watches"; price = 300

        elif i in range(55, 75):
            category = "shorts"
            price = 85
            name = f"Pro-Performance Graphic Shorts {i}"

        elif i in range(75, 99):
            category = "watches"
            price = 250
            names = {
                75: "Midnight Stealth Digital Watch",
                76: "Olive Tactical G-Shock",
                77: "Digital Desert Camo Watch",
                78: "Frost White Digital Watch",
                79: "Vibrant Red Digital Watch",
                80: "Military Green Tactical Watch",
                81: "Chrono Silver Watch",
                82: "Executive Gold Watch",
                83: "Deep Blue Diver Watch",
                84: "Carbon Black Sport Watch",
                85: "Arctic Camo Digital Watch"
            }
            name = names.get(i, f"Precision Digital Watch {i}")

        products.append({
            "id": i,
            "price": price,
            "img": f"assets/img/{filename}",
            "category": category,
            "name": name
        })

    # ---------------------------------------------------------
    # BATCH 2 (29 timestamp) - IDs 99-144
    # ---------------------------------------------------------
    for i in range(1, 47):
        filename = f"photo_{i}_2026-03-19_21-03-29.jpg"
        global_id = 98 + i
        
        # Default values
        name = f"ACE Premium Drop {global_id}"
        category = "others"
        price = 130
        
        # Range logic for Batch 2
        if i == 1:
            category = "others"
            name = "Premium Watch Collection Case"
            price = 180
        elif i in range(2, 5):
            category = "shirts"
            names = {2: "ABTIS Classic White Polo", 3: "ABTIS Deep Green Polo", 4: "ABTIS Ash Grey Polo"}
            name = names.get(i)
            price = 110
        elif i in range(5, 7):
            category = "pants"
            names = {5: "Tan Saintage Track Pants", 6: "Ash Grey Saintage Track Pants"}
            name = names.get(i)
            price = 120
        elif i in range(7, 40):
            category = "watches"
            price = 220
            names = {
                7: "Onyx Black Sport Watch",
                8: "Crimson Sport Watch",
                9: "Royal Blue Sport Watch",
                10: "Stealth Black Digital Watch",
                20: "Midnight G-Shock Edition",
                21: "Electric Orange Digital Watch",
                22: "Neon Yellow Sport Watch",
                23: "Slate Grey Precision Watch",
                24: "Gold & Black Chronograph",
                25: "Azure Blue Executive Watch",
                30: "Rose Gold Elegance Watch",
                31: "Obsidian Leather Chrono",
                32: "Sterling Silver Diver Watch",
                33: "Minimalist Black Watch",
                34: "Vintage Brown Leather Watch"
            }
            name = names.get(i, f"Precision Timepiece {global_id}")
        elif i in range(40, 47):
            category = "shirts"
            price = 110
            names = {
                40: "Diesel Vintage Plaid Shirt",
                41: "Brand 1974 Black Plaid Polo",
                42: "Yellow Checkered Designer Shirt",
                43: "Brand 1974 Yellow Plaid Shirt",
                44: "Diesel Royal Blue Plaid Shirt",
                45: "Brand 1974 Sky Blue Plaid Polo",
                46: "Suprichas Maroon Grid Shirt"
            }
            name = names.get(i, f"Premium Cotton Shirt {global_id}")

        products.append({
            "id": global_id,
            "price": price,
            "img": f"assets/img/{filename}",
            "category": category,
            "name": name
        })

    # Save to data/products.json
    output_dir = os.path.join(os.getcwd(), "data")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    output_path = os.path.join(output_dir, "products.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2)
    
    print(f"Successfully generated {len(products)} products in {output_path}")

if __name__ == "__main__":
    generate_products()
