### SRP Single Responsibility Principle

**SRP**- One class, one responsibility. Single Responsibility Principle states that a class should have only one reason to change.

**Code**
```
public class Invoice
{
    public void AddItem(string itemName, decimal price)
    {
        // Logic to add an item to the invoice        
    }
    public decimal GetTotal()
    {
        // Logic to calculate the total amount of the invoice
        return 0.0m; // Placeholder return value
    }


}
```
_dfining print and save methods here in Invoice class violates SRP_

### OCP Open Closed Principle
- classes should be open for extension but closed for modification
- here we can add new discount without modifying the existing code and checkout class

**Code**
```
public abstract class DiscountStrategy
{
    public abstract decimal ApplyDiscount(decimal amount);
}

public class NoDiscount: DiscountStrategy
{
    public override decimal ApplyDiscount(decimal amount)
    {
        return amount; // No discount applied
    }
}

public class SeasonalDiscount : DiscountStrategy
{
    private readonly double _discountPercentage;

    public SeasonalDiscount(double discountPercentage)
    {
        _discountPercentage = discountPercentage;
    }

    public override decimal ApplyDiscount(decimal amount)
    {
        return amount - (amount * (decimal)_discountPercentage / 100);
    }
}

public class Checkout
{
    public decimal TotalPaymentAmount(decimal amount, DiscountStrategy strategy) => strategy.ApplyDiscount(amount); 

}
```

### Liskov Substitution Principle
- subtypes must be substitutable for their base types without altering the correctness of the program

**Code**
```
public interface IShape
{
    double Area();
}

public class Rectangle : IShape
{
    private double _width;
    private double _height;

    public Rectangle(double width, double height)
    {
        _width = width;
        _height = height;
    }

    public double Area()
    {
        return _width * _height;
    }
}

public class Square : IShape
{
    private double _side;

    public Square(double side)
    {
        _side = side;
    }

    public double Area()
    {
        return _side * _side;
    }
}

public class Circle : IShape
{
    private double _radius;

    public Circle(double radius)
    {
        _radius = radius;
    }

    public double Area()
    {
        return Math.PI * _radius * _radius;
    }
}

public class AreaCalculator
{ 
    public static void Main(string[] args)
    {
        IShape rectangle = new Rectangle(5, 10);
        IShape square = new Square(4);
        IShape circle = new Circle(3);

        AreaCalculator calculator = new AreaCalculator();
        Console.WriteLine($"Rectangle Area: {calculator.CalculateArea(rectangle)}");
        Console.WriteLine($"Square Area: {calculator.CalculateArea(square)}");
        Console.WriteLine($"Circle Area: {calculator.CalculateArea(circle)}");
    }
    public double CalculateArea(IShape shape)
    {
        return shape.Area();
    }
}
```

### Interface Segregation Principle
- Small focused interface. No client should be forced to depend on methods/interfaces it does not use

**Code**
```
// no client should be forced to depend on methods/interfaces it does not use

public interface IPrinter
{
    void Print();
}
public interface IScanner
{
    void Scan();
}

public class SmartPrinter : IPrinter, IScanner
{
    public void Print()
    {
        Console.WriteLine("Printing document...");
    }

    public void Scan()
    {
        Console.WriteLine("Scanning document...");
    }
}

public class SimplePrinter : IPrinter
{
    public void Print()
    {
        Console.WriteLine("Printing document...");
    }
}
```
**avoid things like below**

```
public interface IMachine
{
    void Print();
    void Scan();
}
```


### Dependency Inversion 
- high level module should not depend on low level module, both should depend on abstractions
- coding against an interface that allows you to change the implementation without changing the code that uses it
- offers flexibility and decoupling for better maintainability and testability

**Code**
```
public interface IMessageService
{
    void SendMessage(string message);
}

public class EmailService : IMessageService
{
    public void SendMessage(string message)
    {
        Console.WriteLine($"Email sent: {message}");
    }
}

public class SmsService : IMessageService
{
    public void SendMessage(string message)
    {
        Console.WriteLine($"SMS sent: {message}");
    }
}
public class Notification
{
    private readonly IMessageService _messageService;


    public Notification(IMessageService messageService)
    {
        _messageService = messageService;
    }
    public void Notify(string message)
    {
        _messageService.SendMessage(message);
    }
}
```
*You can inject any message service Sms or Email*
