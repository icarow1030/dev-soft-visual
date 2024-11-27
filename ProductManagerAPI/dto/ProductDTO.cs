namespace API.DTOs
{
    public class ProductDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }

    }

    public class CategoryDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<ProductDTO> Products { get; set; }
    }

    public class ProductCategoryDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public string CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}