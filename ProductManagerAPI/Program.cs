using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Utils;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>();
var app = builder.Build();


// --------------------------------------------
// CRUD operations for Products

// Product: Create
app.MapPost("/product", async (Product product, AppDbContext context) => {
    try {
        Utils.ProductAttributeValidation(product);
        Utils.CategoryExists(context, product.CategoryId);
        product.Id = Guid.NewGuid().ToString();
        product.Category = await context.Categories.FindAsync(product.CategoryId);
        context.Add(product);
        await context.SaveChangesAsync();
        return Results.Created($"/product/{product.Id}", Utils.ToProductCategoryDto(product));
    } catch(Exception e) {
        return Results.BadRequest(e.Message);
    }
});

// Product: Remove
app.MapDelete("/product/{id}", async (string id, AppDbContext context) => {
    try {
        var product = Utils.ProductExists(context, id);
        context.Products.Remove(product);
        await context.SaveChangesAsync();
        return Results.Ok("Product removed");
    } catch(Exception e) {
        return Results.BadRequest(e.Message);
    }
});

// Product: Return All
app.MapGet("/products", async (AppDbContext context) => {
    if(context.Products.Count() == 0) {
        return Results.NotFound("No products found");
    }
    var products = await context.Products.Include(p => p.Category).ToListAsync();
    var productDtos = products.Select(p => Utils.ToProductCategoryDto(p)).ToList();
    return Results.Ok(productDtos);
});

// Product: Return One Product by id
app.MapGet("/products/{id}", async (string id, AppDbContext context) => {
    try {
        var product = Utils.ProductExists(context, id);
        return Results.Ok(Utils.ToProductCategoryDto(product));
    } catch(Exception e) {
        return Results.BadRequest(e.Message);
    }
});

// CRUD operations por Category
// Category: Create
app.MapPost("/category", async (Category category, AppDbContext context) => {
    try {
        Utils.CategoryAttributeValidation(category);
        Utils.CategoryAlreadyExists(context, category.Name);
        category.Id = Guid.NewGuid().ToString();
        category.Products = new List<Product>();
        context.Add(category);
        await context.SaveChangesAsync();
        return Results.Created($"/category/{category.Id}", Utils.ToCategoryDto(category));
    } catch(Exception e) {
        return Results.BadRequest(e.Message);
    }
});

// Category: Remove
app.MapDelete("/category/{id}", async (string id, AppDbContext context) => {
    try {
        var category = Utils.CategoryExists(context, id);
        context.Products.RemoveRange(context.Products.Where(p => p.CategoryId.Equals(id)));
        context.Categories.Remove(category);
        await context.SaveChangesAsync();
        return Results.Ok("Category removed");
    } catch(Exception e) {
        return Results.BadRequest(e.Message);
    }
});

// Category: Return All
app.MapGet("/categories", async (AppDbContext context) => {
    if(context.Categories.Count() == 0) {
        Results.NotFound("No categories found");
    }
    var categories = await context.Categories
        .Include(c => c.Products)
        .ToListAsync();
    var categoryDtos = categories.Select(c => Utils.ToCategoryDto(c)).ToList();
    return Results.Ok(categoryDtos);
});

// Category: Return One Category by name
app.MapGet("/categories/{name}", async (string name, AppDbContext context) => {
    try {
        var category = Utils.CategoryExistsByName(context, name);
        return Results.Ok(Utils.ToCategoryDto(category));
    } catch(Exception e) {
        return Results.BadRequest(e.Message);
    }
});

app.Run();
