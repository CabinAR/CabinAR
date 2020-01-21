require "rails_helper"


describe Space do


  let(:space) { create(:space) }


  describe "#add_user" do

    it "adds a user to a space" do
      expect do
        space.add_user(create(:user))
      end.to change { space.user_spaces.count }.by(1) 
    end
  end

end
