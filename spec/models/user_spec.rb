require "rails_helper"


describe User do


  describe "#from_omniauth" do

    let(:auth) {
      double(:auth, provider: "google_oauth2", uid: "2342342", info: double(:info, email: "bob@cykod.com"))
    }

    it "creates a user if one doesn't exist" do
      expect do
        User.from_omniauth(auth)
      end.to change { User.count }.by(1)

      u = User.last
      expect(u.provider).to eq "google_oauth2"
      expect(u.uid).to eq "2342342"
      expect(u.email).to eq "bob@cykod.com"
    end

    it 'uses the existing user if one exists' do
      user = create :user, email: "bob@cykod.com", provider: "google_oauth2", uid:  "2342342"

      u2 = nil
       expect do
        u2 = User.from_omniauth(auth)
      end.to change { User.count }.by(0)

      expect(u2).to eq user
    end
  end


  describe "#admin_for?" do
    it "returns true if I'm and admin for a space" do
      space = create(:space)
      user = create(:user)

      space.add_user(user, admin: true)

      expect(user.admin_for?(space)).to eq true
    end
  end


  describe "#add_to_resources" do

    it "doesn't do anything if there's no RESOURCE_SPACE_ID set" do
      allow(ENV).to receive(:[]).with("RESOURCE_SPACE_ID").and_return("-1")

      expect do 
        user = create(:user)
      end.to change { UserSpace.count }.by(0)
    end


    it "adds a user is RESOURCE_SPACE_ID to a valid space " do
      space = create(:space)
      allow(ENV).to receive(:[]).with("RESOURCE_SPACE_ID").and_return(space.id.to_s)

      user = nil
      expect do 
        user = create(:user)
      end.to change { UserSpace.count }.by(1)

      expect(UserSpace.last.space.id).to eq space.id
      expect(UserSpace.last.user.id).to eq user.id
      expect(UserSpace.last.admin).to eq false
    end

  end
end