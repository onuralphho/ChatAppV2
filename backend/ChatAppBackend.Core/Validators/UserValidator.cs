
using ChatAppBackend.Core.Entities;
using ChatAppBackend.Core.Models.User.Request;
using FluentValidation;

namespace ChatAppBackend.Core.Validators
{


    public class UserAuthFormValidator : AbstractValidator<RegisterDto>
    {
        public UserAuthFormValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("email_empty_error")
                .EmailAddress()
                .WithMessage("not_email_error");
            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("password_empty_error")
                .MinimumLength(3)
                .WithMessage("password_min_length_error")
                .MaximumLength(20)
                .WithMessage("password_max_length_error");
        }
    }

    public class UserFeelingValidator : AbstractValidator<UpdateUserFeelingDto>
    {
        public UserFeelingValidator()
        {
            RuleFor(x => x.Feeling).MaximumLength(20).WithMessage("feeling_max_length_error");

        }
    }

    public class UserPasswordValidator : AbstractValidator<UpdatePasswordDto>
    {
        public UserPasswordValidator()
        {
            RuleFor(x => x.NewPassword).MinimumLength(3).WithMessage("password_min_length_error").MaximumLength(20).WithMessage("password_max_length_error");

        }
    }

    public class UserUpdateValidator : AbstractValidator<UpdateUserDto>
    {
        public UserUpdateValidator()
        {
            RuleFor(x => x.Name).MinimumLength(2).WithMessage("name_min_lenght_error").MaximumLength(20).WithMessage("name_max_lenght_error");

        }
    }

}
