import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../components/products/productCard";
import { productAPI } from "../../services/api";
import theme from "../../theme";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: null, name: "All" },
    { id: 1, name: "Tops" },
    { id: 2, name: "Bottoms" },
    { id: 3, name: "Dresses" },
    { id: 4, name: "Outerwear" },
    { id: 5, name: "Accessories" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params = {
        page: 1,
        limit: 20,
      };

      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const response = await productAPI.getAll(params);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productWrapper}>
      <ProductCard
        product={item}
        onPress={() => {
          console.log("🔵 Product clicked:", item.id);
          navigation.navigate("ProductDetail", {
            productId: item.id,
          });
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ivy</Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color={theme.colors.text.tertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={theme.colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories - Minimal Pills */}
      <FlatList
        horizontal={true}
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesList}
      />

      {/* Products Grid - Clean Layout */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? "Loading..." : "No products found"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA", // Soft off-white background
  },
  header: {
    flexDirection: "row",
    alignItems: "center", // Ensures "ivy" and search bar align vertically
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: "#FAFAFA",
    gap: 15, // Adds space between title and search bar
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "400",
    color: "#1A1A1A",
    letterSpacing: 1.5,
    textTransform: "lowercase",
    // Remove justifyContent from here if it was there
  },
  searchContainer: {
    flex: 1, // 👈 CHANGE THIS: It will take up remaining width correctly
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40, // 👈 ADD THIS: Fixed height looks better for search
    borderWidth: 1, // 2 was a bit thick for minimalist look
    borderColor: "#E8E8E8",
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1A1A1A",
    fontWeight: "400",
  },
  categoriesList: {
    marginTop: 10,
    marginBottom: 6,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 8,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "transparent",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    alignSelf: "center",
  },
  categoryChipActive: {
    backgroundColor: "#1A1A1A",
    borderColor: "#1A1A1A",
  },
  categoryText: {
    fontSize: 13,
    color: "#4A4A4A",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  productsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },
  productWrapper: {
    width: "48%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xxl * 3,
  },
  emptyText: {
    fontSize: 14,
    color: "#999999",
    fontWeight: "300",
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
