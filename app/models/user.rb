class User < ApplicationRecord
  extend Devise::Models
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_many :spaces
  has_many :pieces


  def generate_token!
    if !self.api_token.present? 
     self.api_token = SecureRandom.urlsafe_base64(64).gsub(/\-/,"")[0..47].downcase
     self.save
   end
 end
end
