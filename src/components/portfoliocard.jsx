function PortfolioCard({
  companyName,
  thumbnail,
  description,
  industry,
  year,
  website,
  buttonText = "Visit Website",
}) {
  return (
    <div className="portfolioCard">
      <h4 className="companyName">{companyName}</h4>

      <img
        className="thumbnail"
        src={thumbnail}
        alt={companyName}
      />

      <div className="tags">
        <span className="industry">{industry}</span>
        <span className="year">{year}</span>
      </div>

      <p className="description">{description}</p>

      <a
        className="companyWebsite btn btn5"
        href={website}
        target="_blank"
      >
        {buttonText}

        <svg
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5014 3.99878V10.4988C12.5014 10.6314 12.4487 10.7586 12.355 10.8523C12.2612 10.9461 12.134 10.9988 12.0014 10.9988C11.8688 10.9988 11.7416 10.9461 11.6479 10.8523C11.5541 10.7586 11.5014 10.6314 11.5014 10.4988V5.20565L4.35516 12.3525C4.26134 12.4464 4.13409 12.4991 4.00141 12.4991C3.86873 12.4991 3.74148 12.4464 3.64766 12.3525C3.55384 12.2587 3.50113 12.1315 3.50113 11.9988C3.50113 11.8661 3.55384 11.7388 3.64766 11.645L10.7945 4.49878H5.50141C5.3688 4.49878 5.24162 4.4461 5.14785 4.35233C5.05409 4.25856 5.00141 4.13139 5.00141 3.99878C5.00141 3.86617 5.05409 3.73899 5.14785 3.64523C5.24162 3.55146 5.3688 3.49878 5.50141 3.49878H12.0014C12.134 3.49878 12.2612 3.55146 12.355 3.64523C12.4487 3.73899 12.5014 3.86617 12.5014 3.99878Z"
            fill="#142035"
          />
        </svg>
      </a>
    </div>
  );
}

export default PortfolioCard;