namespace ChatAppBackend.Core.Exceptions
{
    public class BadRequestException : Exception
    {
        public string ErrorCode { get; set; }
        public BadRequestException(string message) : base(message)
        {

        }

        public BadRequestException(string message,string errorCode):base(message) {
            ErrorCode = errorCode;
        }
    }
}
