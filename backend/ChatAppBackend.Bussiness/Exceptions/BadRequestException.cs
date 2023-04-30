namespace ChatAppBackend.Exceptions
{
    public class BadRequestException:System.Exception
    {
        public BadRequestException(string message) : base(message)
        {

        }
    }
}
