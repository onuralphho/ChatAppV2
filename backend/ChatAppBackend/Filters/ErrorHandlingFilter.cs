using ChatAppBackend.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace ChatAppBackend.Filters
{
    public class ErrorHandlingFilter : ExceptionFilterAttribute
    {

        public override void OnException(ExceptionContext context)
        {
            var exception = context.Exception;
            var problemDetails = new ProblemDetails();
            if (exception is BadRequestException)
            {
                problemDetails.Title = exception.Message;
                problemDetails.Status = (int)HttpStatusCode.BadRequest;

            }
            else if (exception is NotFoundException)
            {
                problemDetails.Title = exception.Message;
                problemDetails.Status = (int)HttpStatusCode.NotFound;
            }
            else
            {
                problemDetails.Title = exception.Message;
                problemDetails.Detail = exception.ToString();
                problemDetails.Status = (int)HttpStatusCode.InternalServerError;
            }

            context.Result = new ObjectResult(problemDetails);

            context.ExceptionHandled = true;

            base.OnException(context);

        }
    }
}
