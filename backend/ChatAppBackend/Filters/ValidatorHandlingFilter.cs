using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Net;

namespace ChatAppBackend.Filters
{
    public class ValidatorHandlingFilter : ActionFilterAttribute
    {
        private Task<ProblemDetails> CreateErrorResponse(ModelStateDictionary modelState)
        {
            var errors = modelState.Values.SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            var result = new ProblemDetails
            {
                Title = "validation_error",
                Status = (int)HttpStatusCode.BadRequest,
                Detail = string.Join(Environment.NewLine, errors)
            };

            return Task.FromResult(result);
        }
        public override async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            if (!context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult(await CreateErrorResponse(context.ModelState));
            }
            await base.OnResultExecutionAsync(context, next);

        }
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errRes = CreateErrorResponse(context.ModelState);
                errRes.Wait();
                context.Result = new BadRequestObjectResult(errRes.Result);
            }
            else
            {
                base.OnActionExecuting(context);
            }

        }
    }
}