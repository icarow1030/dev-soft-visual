using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Category
{
    public Category()
    {
    }

    [Required]
    public string Id { get; set; }
    public string Name { get; set;}
    public List<Product> Products { get; set;}
}