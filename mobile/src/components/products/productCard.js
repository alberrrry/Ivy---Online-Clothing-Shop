import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../../theme';

const ProductCard = ({ product, onPress }) => {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {primaryImage?.url ? (
          <Image
            source={{ uri: primaryImage.url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPercent}%</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.businessName} numberOfLines={1}>
          {product.business_name || 'Store'}
        </Text>
        
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${parseFloat(product.price).toFixed(2)}</Text>
          
          {hasDiscount && (
            <Text style={styles.comparePrice}>
              ${parseFloat(product.compare_at_price).toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: theme.colors.beige,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.beige,
  },
  placeholderText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
  },
  discountBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.inverse,
  },
  content: {
    padding: theme.spacing.md,
  },
  businessName: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  comparePrice: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    textDecorationLine: 'line-through',
  },
});

export default ProductCard;