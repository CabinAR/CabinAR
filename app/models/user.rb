class User < ApplicationRecord
  extend Devise::Models
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, 
         :omniauthable, omniauth_providers: %i[google_oauth2]


  has_many :user_spaces
  has_many :spaces, through: :user_spaces
  has_many :pieces

  before_create :generate_token!

  after_create :convert_user_spaces
  after_create :add_to_resources

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
    end
  end

  def admin_for?(space)
    user_spaces.where(space_id: space.id, admin: true).present?
  end


  def to_builder
    Jbuilder.new do |json|
      json.(self, :id, :api_token, :email)
    end
  end



  def name
    self.email.split("@")[0]
  end


  def generate_token!
    if !self.api_token.present? 
     self.api_token = token_try
     while User.unscoped.find_by_api_token(api_token)
       self.api_token = token_try
     end
   end
 end

 def token_try 
   SecureRandom.urlsafe_base64(64).downcase.gsub(/\-10ol/,"")[0..4].downcase
 end



 def convert_user_spaces 
  UserSpace.where(email: self.email).where(user_id: nil).each do |us|
    us.convert!
  end
 end


 def add_to_resources
  if ENV['RESOURCE_SPACE_ID'].present?
    space = Space.find_by_id(ENV['RESOURCE_SPACE_ID'].to_i)
    space&.add_user(self)
  end
 end

end
