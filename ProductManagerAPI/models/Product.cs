using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Product
{
    public Product()
    {
    }

    [Required]
    public string Id { get; set;}
    public string Name { get; set; }
    public double Price { get; set; }
    public Category? Category { get; set; }
    public string CategoryId { get; set; }
}