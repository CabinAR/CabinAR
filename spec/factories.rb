# This will guess the User class
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@cykod.com" }
    password { "12312313"}

    trait :google do
      provider { "google" }
      sequence(:uid) { |n| n }
    end
  end

  factory :space do
    sequence(:name) { |n| "Space Name #{n}" }
    user
  end

end
