class UserSpace < ApplicationRecord
   belongs_to :user, required: false
   belongs_to :space

   before_validation :trim_email
   before_create :find_user

   validates :email, uniqueness: { scope: :space_id }
   validates :user, uniqueness: { scope: :space_id }, allow_nil: true
   validates :email, presence: true, 'valid_email_2/email': true

   def convert!
     user = User.where(email:self.email).take
     self.update(user: user)
   end

   protected

   def trim_email
    self.email = self.email.strip.downcase
   end

   def find_user
    self.user ||= User.where(email: self.email).take
  end
end