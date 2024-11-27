using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;
namespace API.Utils;

public class Utils {

    public static Category CategoryExists(AppDbContext context, string categoryId) {
        if (!context.Categories.Any(c => c.Id.Equals(categoryId))) {
            throw new Exception("Category not found");
        }
        return context.Categories.First(c => c.Id.Equals(categoryId));
    }

    public static Category CategoryExistsByName(AppDbContext context, string categoryName) {
        if (!context.Categories.Any(c => c.Name.Equals(categoryName))) {
            throw new Exception("Category not found");
        }
        return context.Categories.First(c => c.Name.Equals(categoryName));
    }

    public static Product ProductExists(AppDbContext context, string productId) {
        var product = context.Products.Include(p => p.Category).FirstOrDefault(p => p.Id.Equals(productId));
        if (product == null) {
            throw new Exception("Product not found");
        }
        return product;
    }

    public static void ProductAttributeValidation(Product product) {
        if (product.Name == null || product.Price <= 0 || product.CategoryId == null) {
            throw new Exception("Invalid product attributes");
        }
    }

    public static void CategoryAttributeValidation(Category category) {
        if (category.Name == null) {
            throw new Exception("Invalid category attributes");
        }
    }

    public static void CategoryAlreadyExists(AppDbContext context, string categoryName) {
        if (context.Categories.Any(c => c.Name.Equals(categoryName))) {
            throw new Exception("Category already exists");
        }
    }

    public static ProductDTO ToProductDto(Product product)
    {
        return new ProductDTO
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
        };
    }

    public static CategoryDTO ToCategoryDto(Category category)
    {
        return new CategoryDTO
        {
            Id = category.Id,
            Name = category.Name,
            Products = category.Products.Select(p => ToProductDto(p)).ToList()
        };
    }

    public static ProductCategoryDTO ToProductCategoryDto(Product product)
    {
        return new ProductCategoryDTO
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            CategoryId = product.CategoryId,
            CategoryName = product.Category.Name
        };
    }
}