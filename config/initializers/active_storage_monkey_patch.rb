
module ActiveStorageAttachmentExtension
 extend ActiveSupport::Concern

  included do
    after_create_commit :after_update_attachment_callback
  end

  private

  def after_update_attachment_callback
    record.after_attachment_update if record.respond_to? :after_attachment_update
  end
end


Rails.configuration.to_prepare do
  ActiveStorage::Attachment.send :include, ::ActiveStorageAttachmentExtension
end