class User < ApplicationRecord
  extend Devise::Models
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, 
         :omniauthable, omniauth_providers: %i[google_oauth2]


  has_many :spaces
  has_many :pieces

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
    end
  end



  def generate_token!
    if !self.api_token.present? 
     self.api_token = SecureRandom.urlsafe_base64(64).gsub(/\-/,"")[0..47].downcase
     self.save
   end
 end
end
