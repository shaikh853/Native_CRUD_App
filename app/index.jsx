import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import AddProduct from "./screens/AddProduct";
import { storeData, getData } from "./utils/storage";


export default function Home() {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: 40000, quantity: 10 },
    { id: 2, name: "Mouse", price: 500, quantity: 100 },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  useEffect(() => {
const loadProducts = async () => {
  const stored = await getData("products");
  if (stored && Array.isArray(stored)) {
    const valid = stored.filter(
      (item) => item && item.id && item.name && item.price && item.quantity
    );
    setProducts(valid);
  }
};


    loadProducts();
  }, []);
  useEffect(() => {
    // alert(JSON.stringify(products));
    storeData("products", JSON.stringify(products)); // or AsyncStorage.setItem
  }, [products]);

  const handleAddProduct = (newProduct) => {
     if (!newProduct || !newProduct.id || !newProduct.name) return;
    setProducts((prev) => [...prev, newProduct]);
    setShowAddForm(false); // return to home after add
  };
  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };
  const handleUpdateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );
    setEditProduct(null);
  };

  if (showAddForm || editProduct) {
    return (
      <AddProduct
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        existingProduct={editProduct}
        showAddForm={setShowAddForm}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Product Inventory</Text>
      <Button title="Add Product" onPress={() => setShowAddForm(true)} />

      <FlatList
        style={{ marginTop: 20 }}
        data={products}
        keyExtractor={(item) => (item?.id ? item.id.toString() : Math.random().toString())}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            <View>
              <Text style={styles.item}>
                {item.name} - ₹{item.price} (x{item.quantity})
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={() => setEditProduct(item)}>
                <Text style={{ color: "blue", fontWeight: "bold" }}>
                  ✏️ Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  🗑 Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  item: {
    paddingVertical: 8,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  deleteBtn: {
    color: "red",
    fontWeight: "bold",
    padding: 5,
  },
});
