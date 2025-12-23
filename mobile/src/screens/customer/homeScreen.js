import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../components/products/productCard";
import { productAPI } from "../../services/api";
import theme from "../../theme";

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

  const renderProduct = ({ item, index }) => (
    <View
      style={[
        styles.productContainer,
        index % 2 === 0 ? styles.productLeft : styles.productRight,
      ]}
    >
      <ProductCard
        product={item}
        onPress={() => console.log("Product pressed:", item.id)}
      />
    </View>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find your style</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => String(item.id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesList}
      />

      <ScrollView
        contentContainerStyle={styles.productsContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? "Loading..." : "No products found"}
            </Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map((item, index) => (
              <View key={item.id} style={styles.productContainer}>
                <ProductCard
                  product={item}
                  onPress={() => console.log("Product pressed:", item.id)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoriesList: {
    flexGrow: 0,
    marginBottom: theme.spacing.md,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  categoryTextActive: {
    color: theme.colors.text.inverse,
  },
  productsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  productContainer: {
    width: "33.33%",
    paddingHorizontal: theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
});

export default HomeScreen;
