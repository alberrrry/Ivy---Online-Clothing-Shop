import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/button";
import { productAPI } from "../../services/api";
import theme from "../../theme";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(productId);
      setProduct(response.data);
    } catch (error) {
      console.error("Fetch product error:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasDiscount =
    product?.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price - product.price) /
          product.compare_at_price) *
          100
      )
    : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <Button onPress={() => navigation.goBack()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Image Gallery */}
        <View style={styles.imageSection}>
          {currentImage?.url ? (
            <Image
              source={{ uri: currentImage.url }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.mainImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}

          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          )}

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
              contentContainerStyle={styles.thumbnailContent}
            >
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImage(index)}
                  style={[
                    styles.thumbnail,
                    selectedImage === index && styles.thumbnailActive,
                  ]}
                >
                  <Image
                    source={{ uri: img.url }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          {/* Seller Name */}
          <Text style={styles.sellerName}>Sold by {product.seller_name}</Text>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ${parseFloat(product.price).toFixed(2)}
            </Text>
            {hasDiscount && (
              <Text style={styles.comparePrice}>
                ${parseFloat(product.compare_at_price).toFixed(2)}
              </Text>
            )}
          </View>

          {/* Condition Badge */}
          {product.condition && (
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>
                Condition: {product.condition.replace("_", " ")}
              </Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Category */}
          {product.category_name && (
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryChip}>
                <Text style={styles.categoryText}>{product.category_name}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <Button
          onPress={() => console.log("Message seller")}
          style={styles.messageButton}
        >
          Message Seller
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButtonText: {
    fontSize: 24,
    color: theme.colors.text.primary,
  },
  imageSection: {
    position: "relative",
  },
  mainImage: {
    // width: width,
    // height: width * 1.2,
    width: 250,
    height: 300,
    backgroundColor: theme.colors.beige,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.tertiary,
  },
  discountBadge: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.inverse,
  },
  thumbnailContainer: {
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
  },
  thumbnailContent: {
    gap: theme.spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    marginRight: theme.spacing.sm,
  },
  thumbnailActive: {
    borderColor: theme.colors.primary,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  infoSection: {
    padding: theme.spacing.lg,
  },
  sellerName: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: theme.spacing.xs,
  },
  productName: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    lineHeight: 32,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  price: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.md,
  },
  comparePrice: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.tertiary,
    textDecorationLine: "line-through",
  },
  conditionBadge: {
    backgroundColor: theme.colors.beige,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: "flex-start",
    marginBottom: theme.spacing.lg,
  },
  conditionText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    textTransform: "capitalize",
  },
  descriptionSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: theme.spacing.xl,
  },
  categoryChip: {
    backgroundColor: theme.colors.beige,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
  bottomBar: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  messageButton: {
    width: "100%",
  },
});

export default ProductDetailScreen;
