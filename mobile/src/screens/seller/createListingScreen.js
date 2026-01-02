import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Button from "../../components/common/button";
import Input from "../../components/common/input";
import theme from "../../theme";
import { productAPI } from "../../services/api";

const CreateListingScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    originalPrice: "",
    category: null,
    condition: "good",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 1, name: "Tops" },
    { id: 2, name: "Bottoms" },
    { id: 3, name: "Dresses" },
    { id: 4, name: "Outerwear" },
    { id: 5, name: "Accessories" },
  ];

  const conditions = [
    { value: "new", label: "New with tags" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  const pickImage = async () => {
    if (images.length >= 5) {
      Alert.alert("Limit Reached", "You can add up to 5 images");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Missing Info", "Please add a title");
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert("Missing Info", "Please add a description");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert("Missing Info", "Please add a valid price");
      return false;
    }
    if (!formData.category) {
      Alert.alert("Missing Info", "Please select a category");
      return false;
    }
    if (images.length === 0) {
      Alert.alert("Missing Info", "Please add at least one photo");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log("🔵 List Item clicked!");
    console.log("📋 Form data:", formData);
    console.log("🖼️ Images:", images);

    if (!validateForm()) {
      console.log("❌ Validation failed");
      return;
    }

    console.log("✅ Validation passed");
    setLoading(true);

    try {
      console.log("🚀 Making API call..."); // ADD THIS

      const imageUrls = images.map(
        (uri, index) =>
          `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=${index}`
      );

      const productData = {
        name: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        compareAtPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : null,
        categoryId: formData.category,
        condition: formData.condition,
        images: imageUrls,
      };

      console.log("📦 Product data:", productData); // ADD THIS

      const response = await productAPI.create(productData);

      console.log("✅ Response:", response); // ADD THIS

      Alert.alert("Success!", "Your item has been listed", [
        {
          text: "OK",
          onPress: () => {
            setFormData({
              title: "",
              description: "",
              price: "",
              originalPrice: "",
              category: null,
              condition: "good",
            });
            setImages([]);
            navigation.navigate("Browse");
          },
        },
      ]);
    } catch (error) {
      console.error("Create listing error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to create listing"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sell an Item</Text>
          <Text style={styles.subtitle}>List your preloved piece</Text>
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos *</Text>
          <Text style={styles.sectionSubtitle}>Add up to 5 photos</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagesContainer}
          >
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.uploadedImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 5 && (
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={pickImage}
              >
                <Text style={styles.addPhotoIcon}>📷</Text>
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Input
            label="Title *"
            placeholder="e.g. Vintage Levi's Jeans"
            value={formData.title}
            onChangeText={(value) => updateFormData("title", value)}
            maxLength={80}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your item... condition, measurements, why you're selling, etc."
            placeholderTextColor={theme.colors.text.tertiary}
            value={formData.description}
            onChangeText={(value) => updateFormData("description", value)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {formData.description.length}/500
          </Text>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  formData.category === cat.id && styles.categoryChipActive,
                ]}
                onPress={() => updateFormData("category", cat.id)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.category === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Condition */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition *</Text>
          <View style={styles.conditionsContainer}>
            {conditions.map((cond) => (
              <TouchableOpacity
                key={cond.value}
                style={[
                  styles.conditionChip,
                  formData.condition === cond.value &&
                    styles.conditionChipActive,
                ]}
                onPress={() => updateFormData("condition", cond.value)}
              >
                <Text
                  style={[
                    styles.conditionText,
                    formData.condition === cond.value &&
                      styles.conditionTextActive,
                  ]}
                >
                  {cond.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Input
            label="Price *"
            placeholder="0.00"
            value={formData.price}
            onChangeText={(value) => updateFormData("price", value)}
            keyboardType="decimal-pad"
          />

          <Input
            label="Original Price (Optional)"
            placeholder="0.00"
            value={formData.originalPrice}
            onChangeText={(value) => updateFormData("originalPrice", value)}
            keyboardType="decimal-pad"
            style={{ marginTop: theme.spacing.md }}
          />
          <Text style={styles.hint}>Show shoppers how much they're saving</Text>
        </View>

        {/* Submit Button */}
        <View style={styles.section}>
          <Button onPress={handleSubmit} loading={loading}>
            List Item
          </Button>
        </View>

        <View style={{ height: 40 }} />
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
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  imagesContainer: {
    flexDirection: "row",
  },
  imageWrapper: {
    position: "relative",
    marginRight: theme.spacing.sm,
  },
  uploadedImage: {
    width: 100,
    height: 120,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.beige,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
  },
  addPhotoButton: {
    width: 100,
    height: 120,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  addPhotoIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  addPhotoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.3,
  },
  textArea: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    minHeight: 120,
  },
  characterCount: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.tertiary,
    textAlign: "right",
    marginTop: theme.spacing.xs,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.primary,
  },
  categoryTextActive: {
    color: theme.colors.text.inverse,
  },
  conditionsContainer: {
    gap: theme.spacing.sm,
  },
  conditionChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  conditionChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  conditionText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  conditionTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weights.medium,
  },
  hint: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
});

export default CreateListingScreen;
