const AddNewDonation = () => {
  return (
    <div className="card full-width-card shadow-lg w-100">
      <div className="card-header  font-size d-flex justify-content-center align-items-center">
        <i className="fa-solid fa-droplet me-2"></i>
        <h4 className="mb-0">Add New Donation</h4>
      </div>

      <div className="card-body">
        <form id="donationForm">
          {/* Donation ID */}
          <div className="mb-3">
            <label htmlFor="donation_id" className="form-label">
              Donation ID
            </label>
            <input
              type="text"
              className="form-control"
              id="donation_id"
              placeholder="Auto-generated"
              disabled
            />
          </div>

          {/* Donor ID & Blood Group */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="donor_id" className="form-label">
                Donor ID
              </label>
              <input
                type="text"
                className="form-control no-border"
                id="donor_id"
                placeholder="Enter Donor ID"
                required
              />
              <div
                id="donorLookupMsg"
                className="form-text text-danger"
                style={{ display: "none" }}
              ></div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="blood_group" className="form-label">
                Blood Group
              </label>
              <select
                className="form-select no-border"
                id="blood_group"
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="col-12 mb-3">
              <label htmlFor="donor_name" className="form-label">
                Donor Name
              </label>
              <input
                type="text"
                className="form-control no-border"
                id="donor_name"
                placeholder="Enter Donor Name"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="donation_date" className="form-label">
                Donation Date
              </label>
              <input
                type="date"
                className="form-control no-border"
                id="donation_date"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="expiry_date" className="form-label">
                Expiry Date
              </label>
              <input
                type="date"
                className="form-control no-border"
                id="expiry_date"
                readOnly
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="btn btn-custom button px-4 py-2">
              Add Donation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewDonation;
